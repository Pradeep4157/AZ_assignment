const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function translateLessonContent(content, language) {
  try {
    const prompt = `
Translate the following lesson JSON into ${language}.

Rules:
- Translate ONLY human-readable text.
- Preserve the JSON structure exactly.
- Do NOT change object keys.
- Do NOT translate:
  - type
  - language
  - code.content
  - video.search_query
- Translate:
  - heading.text
  - paragraph.text
  - video.caption
  - mcq.question
  - mcq.options
  - mcq.correct_answer

Return ONLY valid JSON.

Lesson JSON:

${JSON.stringify(content, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const translated = JSON.parse(response.text.trim());

    if (!Array.isArray(translated)) {
      throw new Error("Translated lesson is not an array.");
    }

    return translated;
  } catch (err) {
    console.error("Lesson Translation Error:", err);
    throw new Error("Failed to translate lesson.");
  }
}

module.exports = { translateLessonContent };
