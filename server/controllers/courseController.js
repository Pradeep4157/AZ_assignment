/*
  Here there are several controllers that take some req from client, exec them with the help

  of service layer and return the response 

  1) createCourseFlow : this is used to create the outline of the course that is just the module 

  titles and lesson titles (not the content of the lesson).

  First we get the topic(which is the prompt entered by the user), then we send that topic to service
  
  layer which gives makes api call to llm to create the course outline, sends that data in the format 

  that we specify..

  Now we have the outline we insert this data in the db and incase there is no error in this process,

  then we return res.status(201) which is used to denote sucessfull insertion of data.

  2) findCourseById : it goess through the course that we get in the req.params and then in the modules key of the Course we do populate and since while designing the schema we 

  had already specified ref as Module mongoose is going to search in the Module for these modules id's in Course schema and then inside Module we have defined Lesson ref in the lessons

  so it will go there and populate the lessons of Module with the actual  content of that.

  

*/
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const {
  generateCourse,
  generateLessonContent,
} = require("../services/aiService");

const createCourseFlow = async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.userId; // Securely pulled from the JWT middleware

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is a required field.",
      });
    }

    const aiOutline = await generateCourse(topic);
    if (!aiOutline || !Array.isArray(aiOutline.modules)) {
      throw new Error("Invalid AI Response format");
    }

    // 1. Create the base course document
    const course = await Course.create({
      prompt: topic,
      title: aiOutline.title,
      description: aiOutline.description || "",
      creator: userId, // FIXED: typo resolved
      modules: [],
    });

    // 2. Loop and generate underlying module structure
    for (const moduleData of aiOutline.modules) {
      const moduleInstance = await Module.create({
        title: moduleData.title,
        course: course._id,
        lessons: [],
      });

      // 3. Populate placeholder lessons (content will be generated on-demand)
      for (const lessonData of moduleData.lessons) {
        const lessonInstance = await Lesson.create({
          title: lessonData.title,
          content: [],
          isEnriched: false,
          module: moduleInstance._id,
        });

        moduleInstance.lessons.push(lessonInstance._id);
      }

      await moduleInstance.save();
      course.modules.push(moduleInstance._id);
    }

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Course architecture successfully compiled and saved.",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Course Flow Controller Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/courses
const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted safely from JWT

    // Find only the courses created by this specific user
    const courses = await Course.find({ creator: userId })
      .sort({ createdAt: -1 }) // Show newest courses first
      .select("title description prompt createdAt"); // Only send back dashboard preview fields

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get User Courses Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const generateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId; // 🔑 Securely pulled from the JWT middleware

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      populate: {
        path: "course",
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // 🛑 SECURITY GATE: Ensure the logged-in user actually owns this course
    const courseOwnerId = lesson.module.course.creator.toString();
    if (courseOwnerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. You do not own this course pipeline.",
      });
    }

    if (lesson.isEnriched) {
      return res.status(200).json({
        success: true,
        data: lesson,
      });
    }
    // 3. 🚨 THE GUARDRAIL: Check if it is currently generating
    if (lesson.isGenerating) {
      return res.status(425).json({
        success: false,
        message:
          "Pipeline busy: This lesson is already being compiled by the AI engine. Please wait.",
      });
    }

    // 4. LOCK THE DOCUMENT: Immediately set isGenerating to true in the database
    await Lesson.findByIdAndUpdate(lessonId, { $set: { isGenerating: true } });
    const courseTitle = lesson.module.course.title;
    const moduleTitle = lesson.module.title;
    const lessonTitle = lesson.title;

    const lessonBlocks = await generateLessonContent(
      courseTitle,
      moduleTitle,
      lessonTitle,
    );

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: {
          content: lessonBlocks,
          isEnriched: true,
          isGenerating: false, // Unlock
        },
      },
      { new: true },
    );

    return res.status(200).json({ success: true, data: updatedLesson });
  } catch (error) {
    // 🚨 IMPORTANT: If the AI crashes, make sure to unlock the document!
    await Lesson.findByIdAndUpdate(lessonId, { $set: { isGenerating: false } });
    console.log("Lesson generation error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createCourseFlow,
  getCourseById,
  getUserCourses,
  generateLesson,
};
