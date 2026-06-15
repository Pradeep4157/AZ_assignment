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
    return outlineData;
  } catch (error) {
    console.error("Ollama Outline Compilation Error:", error);
    throw new Error("Failed to generate course blueprint layout locally.");
  }
}

module.exports = generateCourse;
