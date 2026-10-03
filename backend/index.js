const functions = require("firebase-functions");
const { GoogleGenAI, Type } = require("@google/genai");

// In a real Firebase environment, you should use Firebase Secret Manager for the API key.
// For local testing with firebase emulators, it will read from your .env file or environment variables.
require('dotenv').config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || functions.config().gemini?.key 
});

exports.analyzeCode = functions.https.onCall(async (data, context) => {
  const studentCode = data.studentCode;

  if (!studentCode) {
    throw new functions.https.HttpsError("invalid-argument", "No code provided.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Analyze the following student code for misconceptions:\n\n${studentCode}`,
      config: {
        systemInstruction: "Analyze the code and classify the underlying misconception. CRITICAL RULES: 1) Address the user naturally in a conversational way. Keep a neutral, professional, and encouraging tone focusing on the code's behavior. Do NOT over-use 'you' and 'your', and NEVER refer to them in the third person as 'the student'. 2) Explain it in extremely simple, everyday English. 3) NEVER use technical jargon like 'concatenation', 'implicit', 'type coercion', or 'operand'. 4) The 'identified_misconception' must be 3 sentences or less.",
        temperature: 0.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identified_misconception: { type: Type.STRING },
            intervention_hint: { type: Type.STRING }
          },
          required: ["identified_misconception", "intervention_hint"],
        },
      }
    });

    const rawText = typeof response.text === 'function' ? response.text() : response.text;
    const cleanText = rawText.replace(/```json\\n|```/g, '').trim();
    return JSON.parse(cleanText); // Sent directly back to the client securely

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new functions.https.HttpsError("internal", error.message || "Failed to analyze code.");
  }
});
