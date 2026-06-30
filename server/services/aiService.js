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

    Return ONLY JSON in this exact format:

    [
      {
        "type": "heading",
        "text": "Lesson title"
      },

      {
        "type": "paragraph",
        "text": "Explanation..."
      },

      {
        "type": "code",
        "language": "javascript",
        "content": "console.log('hello');"
      },

      {
        "type": "video",
        "url": "https://example.com/video",
        "caption": "Video description"
      },

      MCQ format MUST be:

      {
        "type": "mcq",
        "question": "What is a class in OOP?",
        "options": [
          "A blueprint for creating objects",
          "A database table",
          "A compiler directive",
          "A network protocol"
        ],
        "correct_answer": "A blueprint for creating objects"
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

    // 1. Parse the cleaned string text into a JSON object/array
    const parsedResponse = JSON.parse(responseText);

    // 2. Dynamically extract the array no matter how the LLM formatted the root
    let lessonBlocks = null;

    if (Array.isArray(parsedResponse)) {
      // Case A: The LLM followed instructions perfectly and gave a top-level array
      lessonBlocks = parsedResponse;
    } else if (parsedResponse && typeof parsedResponse === "object") {
      // Case B: The LLM wrapped it in an object. Let's find the array!

      // First, check your preferred choice
      if (Array.isArray(parsedResponse.content)) {
        lessonBlocks = parsedResponse.content;
      } else {
        // Fallback: Loop through keys to find the first one that contains an array
        const arrayKey = Object.keys(parsedResponse).find((key) =>
          Array.isArray(parsedResponse[key]),
        );
        if (arrayKey) {
          console.log(
            `🤖 LLM Quirking: Extracted array from unexpected key: "${arrayKey}"`,
          );
          lessonBlocks = parsedResponse[arrayKey];
        }
      }
    }

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
