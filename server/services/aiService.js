const ollama = require("ollama").default;

async function generateCourse(topic) {
  try {
    const prompt = `
    Create a structured outline layout for a course on the topic: "${topic}".
    Provide 3 comprehensive modules, with each module containing 3 highly relevant lessons.

    You must output your response inside this exact JSON format layout:
    {
      "title": "Course Title String",
      "description": "Comprehensive course overview description",
      "modules": [
        {
          "title": "Module Title String",
          "lessons": [
            {
              "title": "Lesson Title String"
            }
          ]
        }
      ]
    }`;

    const response = await ollama.chat({
      model: "gemma3:4b",
      messages: [
        {
          role: "system",
          content:
            "You are an expert syllabus compiler. You must respond ONLY with a raw JSON object matching the requested template format. Do not use markdown backticks, conversational chat text, or introductory notes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      format: "json",
      options: {
        temperature: 0.6,
      },
    });

    const outlineData = JSON.parse(response.message.content);
    console.log(
      " nigga we completed generateCourse and this is the outline data : ",
      outlineData,
    );
    return outlineData;
  } catch (error) {
    console.error("Ollama Outline Compilation Error:", error);
    throw new Error("Failed to generate course blueprint layout locally.");
  }
}

async function generateLessonContent(courseTitle, moduleTitle, lessonTitle) {
  try {
    const prompt = `
    You are an expert technical educator creating deep, production-grade learning material.

    Generate a comprehensive lesson for:

    Course: "${courseTitle}"
    Module: "${moduleTitle}"
    Lesson: "${lessonTitle}"

    REQUIREMENTS:

    1. Include:
       - 1 heading block
       - Multiple paragraph blocks
       - Exactly 1 code block
       - 1 video block
       - Exactly 3 MCQs

    2. Output ONLY valid JSON.

    3. Return an array of content blocks.

    Example:

    [
      {
        "type":"heading",
        "text":"Lesson Title"
      },
      {
        "type":"paragraph",
        "text":"Explanation..."
      }
    ]
    `;

    const response = await ollama.chat({
      model: "gemma3:4b",
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum developer. Respond ONLY with a valid JSON array. No markdown. No explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      format: "json",
      options: {
        temperature: 0.3,
      },
    });
    console.log("RAW LESSON RESPONSE:\n", response.message.content);
    let responseText = response.message.content.trim();

    // Remove accidental markdown fences
    responseText = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    const parsedResponse = JSON.parse(responseText);

    const lessonBlocks = Array.isArray(parsedResponse)
      ? parsedResponse
      : parsedResponse.content;

    if (!Array.isArray(lessonBlocks)) {
      throw new Error("AI did not return a valid content array");
    }

    // Basic validation
    const hasHeading = lessonBlocks.some((block) => block.type === "heading");

    const hasCode = lessonBlocks.some((block) => block.type === "code");

    const mcqCount = lessonBlocks.filter(
      (block) => block.type === "mcq",
    ).length;

    if (!hasHeading) {
      throw new Error("Missing heading block");
    }

    if (!hasCode) {
      throw new Error("Missing code block");
    }

    if (mcqCount !== 3) {
      throw new Error("Expected exactly 3 MCQs");
    }

    return lessonBlocks;
  } catch (error) {
    console.error("Ollama Lesson Generation Error:", error);

    throw new Error("Failed to generate lesson content.");
  }
}

module.exports = { generateCourse, generateLessonContent };
