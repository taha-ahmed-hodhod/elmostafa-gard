import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

// Initialize Gemini client only if key exists, otherwise we just export the class/functions safely
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Example function to generate table data using Gemini.
 * This can be connected to the UI later to "Auto-fill" the table.
 */
export const generateTableData = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a data assistant. Return only JSON array of arrays representing a table.",
        responseMimeType: "application/json"
      }
    });
    
    return response.text || "[]";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
