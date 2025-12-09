import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, ManseResult, ChongunResult } from "../types";

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

// --- Schema definitions for ManseResult ---
const pillarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stem: { 
      type: Type.OBJECT, 
      properties: { 
        char: { type: Type.STRING },
        hangul: { type: Type.STRING },
        color: { type: Type.STRING },
        element: { type: Type.STRING },
        tenGod: { type: Type.STRING }
      } 
    },
    branch: { 
      type: Type.OBJECT, 
      properties: { 
        char: { type: Type.STRING },
        hangul: { type: Type.STRING },
        color: { type: Type.STRING },
        element: { type: Type.STRING },
        tenGod: { type: Type.STRING },
        animal: { type: Type.STRING }
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
        color: { type: Type.STRING },
        element: { type: Type.STRING },
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
    shipseong: {
      type: Type.OBJECT,
      properties: {
        bi: { type: Type.NUMBER },
        sik: { type: Type.NUMBER },
        jae: { type: Type.NUMBER },
        gwan: { type: Type.NUMBER },
        in: { type: Type.NUMBER }
      },
      description: "Percentage distribution of Ten Gods (Total 100%)"
    },
    strength: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        description: { type: Type.STRING }
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

// --- Schema definitions for ChongunResult ---
const chongunSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    userName: { type: Type.STRING },
    summary: { type: Type.STRING, description: "Overall summary of the destiny" },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 keywords representing the person" },
    sections: {
      type: Type.OBJECT,
      properties: {
        selfView: { type: Type.STRING, description: "How I see myself" },
        othersView: { type: Type.STRING, description: "How others see me" },
        talent: { type: Type.STRING, description: "Talents and aptitude" },
        wealth: { type: Type.STRING, description: "Wealth luck" },
        love: { type: Type.STRING, description: "Love and relationships" },
        work: { type: Type.STRING, description: "Career and work style" },
        health: { type: Type.STRING, description: "Health and social luck" },
      }
    },
    advice: { type: Type.STRING }
  }
};

// --- API Calls ---

export const getGeminiFortune = async (data: UserSajuData): Promise<ManseResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 전문적인 '만세력(Saju Manse)' 계산 및 분석가입니다.
    사용자: ${data.name}, ${data.gender}, ${data.birthDate} ${data.birthTime}, ${data.calendarType}, ${data.birthRegion} (한국 기준).

    요구사항:
    1. 정확한 만세력(4기둥) 한자/한글 독음 계산.
    2. 오행/십성 비율(%) 및 신강/신약 점수(0~100) 계산.
    3. 대운 흐름 계산.
    4. 2025년 운세 및 성격 분석.
    
    JSON 스키마를 엄격히 준수하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are an expert Saju Master. Return only pure JSON data matching the ManseResult schema.",
      responseMimeType: "application/json",
      responseSchema: manseSchema,
      temperature: 0.4,
    },
  });

  if (response.text) return JSON.parse(response.text) as ManseResult;
  throw new Error("만세력 생성 실패");
};

export const getChongunFortune = async (data: UserSajuData): Promise<ChongunResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash"; // Using flash for speed/text generation

  const prompt = `
    당신은 통찰력 있는 사주 명리학자 '도사님'입니다.
    사용자 정보를 바탕으로 깊이 있는 '사주 총운'을 상세하게 풀이해주세요.
    말투는 차분하고 신뢰감 있으며, 사용자의 마음을 꿰뚫어 보는 듯한 문체를 사용하세요. (예: "당신은 ~한 사람입니다.", "~하는 경향이 있군요.")

    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate} ${data.birthTime}
    음력/양력: ${data.calendarType}
    출생지: ${data.birthRegion}

    [필수 포함 내용]
    1. 사주 총론 요약 (한눈에 보는 나)
    2. 나를 표현하는 키워드 3~4개
    3. 상세 풀이 항목:
       - 내가 아는 내 모습 (내면)
       - 남이 보는 내 모습 (외면/사회성)
       - 타고난 재능과 적성
       - 타고난 재물운
       - 타고난 애정운
       - 타고난 일복 (직업운)
       - 타고난 인복 (대인관계)
    4. 도사님의 따뜻한 조언

    JSON 스키마를 준수하여 데이터를 반환하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a wise Saju fortune teller. Provide detailed, insightful text readings in Korean.",
      responseMimeType: "application/json",
      responseSchema: chongunSchema,
      temperature: 0.7, // Higher temperature for more creative/natural text
    },
  });

  if (response.text) return JSON.parse(response.text) as ChongunResult;
  throw new Error("사주 총운 생성 실패");
};