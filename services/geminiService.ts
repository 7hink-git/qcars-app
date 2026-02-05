import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AIRecommendation } from "../types";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

export const getCarRecommendations = async (userPrompt: string): Promise<AIRecommendation> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            recommendedCarIds: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "List of car IDs from the inventory that match the user request."
            },
            message: {
              type: SchemaType.STRING,
              description: "A helpful message explaining the recommendation to the user."
            }
          },
          required: ["recommendedCarIds", "message"]
        }
      }
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();
    
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