import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AIRecommendation } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey });

export const getCarRecommendations = async (userPrompt: string): Promise<AIRecommendation> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCarIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of car IDs from the inventory that match the user request."
            },
            message: {
              type: Type.STRING,
              description: "A helpful message explaining the recommendation to the user."
            }
          },
          required: ["recommendedCarIds", "message"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIRecommendation;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      recommendedCarIds: [],
      message: "I'm having a little trouble connecting to my brain right now. Please browse our collection manually!"
    };
  }
};