import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, ManseResult } from "../types";

// Helper function to safely get the API Key
const getApiKey = (): string | undefined => {
  try {
    if (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) {
      return (import.meta as any).env.VITE_API_KEY;
    }
  } catch (e) {}

  if (typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    if (process.env.API_KEY) return process.env.API_KEY;
  }
  return undefined;
};

// Define Schema for structured JSON output
const pillarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stem: { 
      type: Type.OBJECT, 
      properties: { 
        char: { type: Type.STRING }, // e.g., 甲
        hangul: { type: Type.STRING }, // e.g., 갑
        color: { type: Type.STRING }, // e.g., #4CAF50
        element: { type: Type.STRING }, // e.g., 木
        tenGod: { type: Type.STRING } // e.g., 비견
      } 
    },
    branch: { 
      type: Type.OBJECT, 
      properties: { 
        char: { type: Type.STRING }, // e.g., 子
        hangul: { type: Type.STRING }, // e.g., 자
        color: { type: Type.STRING },
        element: { type: Type.STRING },
        tenGod: { type: Type.STRING },
        animal: { type: Type.STRING } // e.g., 쥐
      } 
    },
    shipseong: { type: Type.ARRAY, items: { type: Type.STRING } },
    unseong: { type: Type.STRING },
    sinsal: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

const manseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    userInfo: {
      type: Type.OBJECT,
      properties: {
        animal: { type: Type.STRING },
        color: { type: Type.STRING }, // Color name e.g., "푸른"
        element: { type: Type.STRING }, // Day Master element
      }
    },
    pillars: {
      type: Type.OBJECT,
      properties: {
        year: pillarSchema,
        month: pillarSchema,
        day: pillarSchema,
        time: pillarSchema
      }
    },
    pillarAnalysis: {
      type: Type.OBJECT,
      properties: {
        year: { type: Type.STRING },
        month: { type: Type.STRING },
        day: { type: Type.STRING },
        time: { type: Type.STRING }
      },
      description: "Easy explanation of what each pillar means for the user"
    },
    ohaeng: {
      type: Type.OBJECT,
      properties: {
        wood: { type: Type.NUMBER },
        fire: { type: Type.NUMBER },
        earth: { type: Type.NUMBER },
        metal: { type: Type.NUMBER },
        water: { type: Type.NUMBER },
        missing: { type: Type.ARRAY, items: { type: Type.STRING } },
        excess: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    daewoon: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          age: { type: Type.NUMBER },
          stem: { type: Type.STRING },
          stemHangul: { type: Type.STRING },
          branch: { type: Type.STRING },
          branchHangul: { type: Type.STRING },
          tenGod: { type: Type.STRING }
        }
      }
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        personality: { type: Type.STRING },
        currentYearLuck: { type: Type.STRING },
        advice: { type: Type.STRING }
      }
    }
  }
};

export const getGeminiFortune = async (data: UserSajuData): Promise<ManseResult> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다. VITE_API_KEY 환경변수를 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 전문적인 '만세력(Saju Manse)' 계산 및 분석가입니다.
    다음 사용자 정보를 바탕으로 사주팔자(4기둥), 오행 분석, 대운, 그리고 성격 및 운세 분석을 정확하게 계산하여 JSON 형식으로 반환해 주세요.

    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate}
    출생 시간: ${data.birthTime}
    음력/양력: ${data.calendarType}
    출생 지역: ${data.birthRegion} (시차 계산용, 한국 기준)

    [요구 사항]
    1. 만세력(Pillars): 연주, 월주, 일주, 시주를 정확한 한자(char)와 **한글 독음(hangul)**과 함께 구하세요. (예: 甲 -> 갑, 子 -> 자).
    2. 기둥별 상세 풀이(Pillar Analysis): 각 기둥(연주, 월주, 일주, 시주)이 이 사람의 인생에서 어떤 의미를 가지는지 초보자도 이해하기 쉽게 2~3문장으로 설명해주세요. (연주: 초년운/조상, 월주: 부모/사회성, 일주: 본인/배우자, 시주: 말년/자식). 한자 용어 대신 쉬운 말로 풀어주세요.
    3. 색상(Color): 천간/지지 글자의 오행 색상을 Hex Code로 반환하세요 (목:Green, 화:Red, 토:Yellow, 금:Gray/White, 수:Black/Blue).
    4. 오행 분석(Ohaeng): 전체 사주에서 오행의 분포 비율(%)을 계산하세요. 합이 100이 되도록 하세요.
    5. 대운(Daewoon): 사용자의 대운수(Daewoon number)를 계산하고, 10년 단위의 대운 흐름을 나열하세요 (나이, 간지 한자, 간지 한글).
    6. 분석(Analysis): 일간(Day Master)을 중심으로 한 성격 분석과 2025년 기준 신년 운세를 친절하고 명확한 존댓말로 작성하세요.

    JSON 스키마를 엄격히 따라주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Saju Master. Return only pure JSON data matching the specified schema. Ensure accurate calculation of Saju pillars based on the Gregorian/Lunar date provided. Provide friendly Korean translations for all Hanja terms.",
        responseMimeType: "application/json",
        responseSchema: manseSchema,
        temperature: 0.4,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ManseResult;
    } else {
      throw new Error("만세력 데이터를 생성하지 못했습니다.");
    }
  } catch (error) {
    console.error("Saju analysis failed:", error);
    throw new Error("사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};