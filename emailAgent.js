const { GoogleGenAI } = require("@google/genai");
const { getKnowledge } = require("./knowledgeBase");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

let pendingEmail = "";

async function emailAgent(userPrompt) {
  const knowledge = getKnowledge();

  const prompt = `
You are a professional email writing assistant.

Use the following knowledge base whenever appropriate.

====================
${knowledge}
====================

User Request:
${userPrompt}

You are an AI Email Writing Agent.

Use the information from the Knowledge Base whenever applicable.

Instructions:
- Use the Manager Name from the knowledge base if the recipient is the manager.
- Use the preferred greeting and closing.
- Follow the specified writing style.
- Include the professional signature exactly as provided.
- Generate a clear subject line.
- Return ONLY the completed email without any explanations.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const email =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate email.";

    pendingEmail = email;

    return {
      status: "WAITING_FOR_CONFIRMATION",
      email,
      message: "Do you approve this email? Reply YES or NO.",
    };
  } catch (error) {
    console.error("Gemini Error:", error);

    if (error.status === 429) {
      return {
        status: "QUOTA_EXCEEDED",
        message:
          "Gemini API quota exceeded. Please verify your Google AI Studio project or try again later.",
      };
    }

    if (error.status === 503) {
      return {
        status: "MODEL_BUSY",
        message:
          "Gemini is currently under heavy load. Please try again in a few moments.",
      };
    }

    return {
      status: "ERROR",
      message: error.message || "Failed to generate email.",
    };
  }
}

function confirmEmail(answer) {
  if (answer.trim().toLowerCase() === "yes") {
    return {
      status: "APPROVED",
      email: pendingEmail,
    };
  }

  return {
    status: "REJECTED",
    message: "Email rejected. Returning to Main Agent.",
  };
}

module.exports = {
  emailAgent,
  confirmEmail,
};