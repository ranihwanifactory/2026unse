import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, FortuneResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    yearTitle: {
      type: Type.STRING,
      description: "The name of the year (e.g., 2025 Blue Snake Year) in Korean.",
    },
    overall: {
      type: Type.STRING,
      description: "Overall fortune summary for the year. Poetic and mystical tone.",
    },
    wealth: {
      type: Type.STRING,
      description: "Wealth and financial fortune.",
    },
    love: {
      type: Type.STRING,
      description: "Love, marriage, and relationship fortune.",
    },
    health: {
      type: Type.STRING,
      description: "Health and physical well-being fortune.",
    },
    career: {
      type: Type.STRING,
      description: "Career, business, and academic fortune.",
    },
    luckyItems: {
      type: Type.STRING,
      description: "Lucky colors, directions, or items for the user.",
    },
  },
  required: ["yearTitle", "overall", "wealth", "love", "health", "career", "luckyItems"],
};

export const getGeminiFortune = async (data: UserSajuData): Promise<FortuneResult> => {
  const model = "gemini-2.5-flash"; // Fast and capable model

  const prompt = `
    당신은 대한민국에서 가장 용하다고 소문난 신점 도사(무당)입니다. 
    사용자의 사주 정보를 바탕으로 2025년(을사년) 신년 운세를 봐주세요.
    
    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate}
    태어난 시간: ${data.birthTime === 'unknown' ? '모름' : data.birthTime}
    양력/음력: ${data.calendarType}

    말투는 예스럽고 권위 있으면서도, 사람을 꿰뚫어 보는 듯한 무속인의 말투(예: "~하구나", "~보이는군", "~해야 할 것이야")를 사용하십시오.
    단순한 번역투가 아닌, 실제 점집에서 듣는 듯한 한국적인 표현을 사용하세요.
    좋은 점은 격려하고, 나쁜 점은 피해갈 방도를 넌지시 일러주십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a traditional Korean Shaman (Mudang). You provide fortune telling based on Saju (Four Pillars of Destiny). Your output must be strictly in JSON format matching the schema.",
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
        temperature: 0.8, // Slightly creative for the "mystical" vibe
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FortuneResult;
    } else {
      throw new Error("운세를 점지받지 못했습니다. (Empty Response)");
    }
  } catch (error) {
    console.error("Fortune telling failed:", error);
    throw new Error("신령님과의 접신이 불안정합니다. 잠시 후 다시 시도해주세요.");
  }
};