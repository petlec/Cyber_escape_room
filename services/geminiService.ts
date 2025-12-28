import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoomImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt + " High quality, cinematic lighting, digital art style, cybernetic atmosphere, 4k resolution, no text.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};

export const generateHint = async (context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Jsi AI průvodce v únikové hře pro děti. Kontext místnosti: ${context}. Hráč si neví rady. Napiš krátkou, povzbudivou nápovědu (max 2 věty), která ho navede, ale neprozradí řešení přímo.`,
    });
    return response.text || "Systémová chyba: Nápověda nedostupná.";
  } catch (error) {
    console.error("Failed to generate hint:", error);
    return "Spojení se serverem ztraceno. Zkuste to znovu.";
  }
};
