
import { GoogleGenAI, Type } from "@google/genai";
import { FreshnessResult } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBananaFreshness = async (base64Image: string): Promise<FreshnessResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this banana image and determine its freshness level. 
  Classify it as one of the following: 'unripe', 'ripe', 'overripe', or 'rotten'.
  Estimate the remaining days until it is best to be eaten (or 0 if already overripe/rotten).
  Provide a detailed description of its appearance, nutritional benefits based on its current stage, and 3 specific storage tips.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1],
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: {
            type: Type.STRING,
            description: "The freshness status: unripe, ripe, overripe, or rotten.",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0 to 1.",
          },
          daysRemaining: {
            type: Type.NUMBER,
            description: "Estimated days remaining for best consumption.",
          },
          description: {
            type: Type.STRING,
            description: "Visual analysis description.",
          },
          storageTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Three storage tips.",
          },
          nutritionalValue: {
            type: Type.STRING,
            description: "Health/Nutritional context of this stage.",
          },
        },
        required: ["status", "confidence", "daysRemaining", "description", "storageTips", "nutritionalValue"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI model.");
  }

  return JSON.parse(response.text) as FreshnessResult;
};
