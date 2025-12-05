import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInfo, FortuneResult, Pillar } from "../types";

// Helper to determine approximate element color for UI based on Celestial Stems
const getElementColor = (stem: string): string => {
  const wood = ['甲', '乙'];
  const fire = ['丙', '丁'];
  const earth = ['戊', '己'];
  const metal = ['庚', '辛'];
  const water = ['壬', '癸'];

  if (wood.includes(stem)) return 'text-green-500';
  if (fire.includes(stem)) return 'text-red-500';
  if (earth.includes(stem)) return 'text-yellow-600';
  if (metal.includes(stem)) return 'text-gray-400';
  if (water.includes(stem)) return 'text-blue-500';
  return 'text-white';
};

const pillarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    heavenlyStem: { type: Type.STRING, description: "Chinese character for Heavenly Stem (e.g., 甲)" },
    earthlyBranch: { type: Type.STRING, description: "Chinese character for Earthly Branch (e.g., 子)" },
    koreanStem: { type: Type.STRING, description: "Korean pronunciation of Stem (e.g., 갑)" },
    koreanBranch: { type: Type.STRING, description: "Korean pronunciation of Branch (e.g., 자)" },
  },
  required: ["heavenlyStem", "earthlyBranch", "koreanStem", "koreanBranch"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    pillars: {
      type: Type.OBJECT,
      properties: {
        year: pillarSchema,
        month: pillarSchema,
        day: pillarSchema,
        hour: pillarSchema,
      },
      required: ["year", "month", "day", "hour"]
    },
    overallLuck: { type: Type.STRING, description: "Overall fortune summary for 2026" },
    wealthLuck: { type: Type.STRING, description: "Wealth luck analysis" },
    careerLuck: { type: Type.STRING, description: "Career or academic luck analysis" },
    loveLuck: { type: Type.STRING, description: "Love and relationship luck analysis" },
    healthLuck: { type: Type.STRING, description: "Health luck analysis" },
    luckyItems: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3 lucky items, colors, or directions"
    },
    advice: { type: Type.STRING, description: "A wise piece of advice or aphorism for the user" }
  },
  required: ["pillars", "overallLuck", "wealthLuck", "careerLuck", "loveLuck", "healthLuck", "luckyItems", "advice"]
};

export const generateFortune = async (userInfo: UserInfo): Promise<FortuneResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are Korea's most famous Saju (Four Pillars of Destiny) master.
    The current year for prediction is **2026** (Byeong-O Year, Year of the Red Horse).
    
    User Information:
    - Name: ${userInfo.name}
    - Gender: ${userInfo.gender}
    - Birth Date: ${userInfo.birthDate}
    - Birth Time: ${userInfo.birthTime}
    - Calendar Type: ${userInfo.calendarType}

    Task:
    1. Calculate the user's Four Pillars (Year, Month, Day, Hour) accurately based on the birth date and time.
    2. Analyze the user's fortune specifically for the year 2026 (Byeong-O). 
    3. Analyze the interaction between the user's pillars and the 2026 Red Horse energy (Fire energy).
    4. Provide the result in Korean language, with a polite, mystical, yet encouraging tone.
    5. Ensure the Chinese characters for the pillars are accurate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // slightly creative for fortune telling
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response generated");

    const parsedData = JSON.parse(jsonText);

    // Post-process to add colors
    const processPillar = (p: any): Pillar => ({
      ...p,
      color: getElementColor(p.heavenlyStem)
    });

    return {
      userName: userInfo.name,
      pillars: {
        year: processPillar(parsedData.pillars.year),
        month: processPillar(parsedData.pillars.month),
        day: processPillar(parsedData.pillars.day),
        hour: processPillar(parsedData.pillars.hour),
      },
      overallLuck: parsedData.overallLuck,
      wealthLuck: parsedData.wealthLuck,
      careerLuck: parsedData.careerLuck,
      loveLuck: parsedData.loveLuck,
      healthLuck: parsedData.healthLuck,
      luckyItems: parsedData.luckyItems,
      advice: parsedData.advice
    };

  } catch (error) {
    console.error("Error generating fortune:", error);
    throw error;
  }
};