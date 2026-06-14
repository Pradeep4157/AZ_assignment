const ollama = require("ollama").default;
async function generateCourse(topic) {
  try {
    const prompt = `
    Create a comprehensive, structured course for the topic: "${topic}".
    You must fill out this exact JSON structure completely:
    {
      "title": "Course Title",
      "description": "Course description here",
      "modules": [
        {
          "moduleTitle": "Module Title",
          "lessons": [
            {
              "lessonTitle": "Lesson Title",
              "objectives": "What the user will learn in this lesson",
              "keyTopics": ["Subtopic 1", "Subtopic 2"],
              "suggestedReading": "Resource or reading links"
            }
          ]
        }
      ]
    }`;
    const response = await ollama.chat({
      model: "gemma3:4b", // Model that i am using
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer. You must respond ONLY with a raw JSON object matching the requested schema. Do not include conversational text, introductory phrases, or markdown blocks like ```json.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // THIS IS CRITICAL: It forces Ollama to output valid JSON syntax 100% of the time
      format: "json",
      options: {
        temperature: 0.7,
      },
    });
    const courseData = JSON.parse(response.message.content);
    return courseData;
  } catch (error) {
    console.log("Ollama Course generation Error : ", error);
    throw new Error("Failed to generate Course content locally");
  }
}
module.exports = generateCourse;
