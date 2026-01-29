
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeText = async (prompt: string, history: { role: 'user' | 'model', content: string }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "你是一位精通金庸小說的文學分析家。請根據《倚天屠龍記》第一回的內容回答問題。語氣優雅、專業，且能深入探討角色內心與文學修辭。",
      }
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，目前 AI 助理無法回應。請檢查您的網絡連接或 API 設置。";
  }
};
