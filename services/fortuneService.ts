import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, ManseResult, ChongunResult, GunghapResult } from "../types";

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

// --- Schema definitions for GunghapResult ---
const gunghapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Compatibility score 0-100" },
    summary: { type: Type.STRING },
    details: {
      type: Type.OBJECT,
      properties: {
        personalityMatch: { type: Type.STRING, description: "Personality compatibility" },
        valueMatch: { type: Type.STRING, description: "Values compatibility" },
        loveStyle: { type: Type.STRING, description: "Love style comparison" },
        conflictResolution: { type: Type.STRING, description: "How they handle conflicts" }
      }
    },
    goodPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    badPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
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
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 통찰력 있는 사주 명리학자 '도사님'입니다.
    사용자 정보를 바탕으로 깊이 있는 '사주 총운'을 상세하게 풀이해주세요.
    
    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate} ${data.birthTime}
    음력/양력: ${data.calendarType}
    출생지: ${data.birthRegion}

    [필수 포함 내용]
    1. 사주 총론 요약 (한눈에 보는 나)
    2. 나를 표현하는 키워드 3~4개
    3. 상세 풀이 항목: 내면, 외면, 재능, 재물, 애정, 직업, 인복
    4. 따뜻한 조언

    JSON 스키마를 준수하여 데이터를 반환하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a wise Saju fortune teller. Provide detailed, insightful text readings in Korean.",
      responseMimeType: "application/json",
      responseSchema: chongunSchema,
      temperature: 0.7,
    },
  });

  if (response.text) return JSON.parse(response.text) as ChongunResult;
  throw new Error("사주 총운 생성 실패");
};

export const getGunghapFortune = async (user1: UserSajuData, user2: UserSajuData): Promise<GunghapResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 궁합 전문 사주가입니다. 두 사람의 사주를 분석하여 궁합을 봐주세요.

    [사용자 1 (본인)]
    이름: ${user1.name}, 성별: ${user1.gender}, 생년월일: ${user1.birthDate} ${user1.birthTime}, ${user1.calendarType}

    [사용자 2 (상대방)]
    이름: ${user2.name}, 성별: ${user2.gender}, 생년월일: ${user2.birthDate} ${user2.birthTime}, ${user2.calendarType}

    [요구 사항]
    1. 궁합 점수(0~100점)를 계산하세요.
    2. 두 사람의 성격, 가치관, 연애 스타일, 갈등 해결 방식을 상세히 분석하세요.
    3. 서로에게 좋은 점 3가지와 주의해야 할 점 3가지를 제시하세요.
    4. 관계를 발전시키기 위한 실질적인 조언을 해주세요.
    
    JSON 스키마를 엄격히 준수하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a Saju compatibility expert. Return detailed compatibility analysis in Korean.",
      responseMimeType: "application/json",
      responseSchema: gunghapSchema,
      temperature: 0.5,
    },
  });

  if (response.text) return JSON.parse(response.text) as GunghapResult;
  throw new Error("궁합 분석 실패");
};