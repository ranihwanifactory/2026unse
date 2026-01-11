import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, ManseResult, ChongunResult, GunghapResult, LottoLuckResult, CelebMatchResult, TravelRecommendResult, SamjaeResult } from "../types";

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

// --- Existing Schemas ---
const pillarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stem: { type: Type.OBJECT, properties: { char: { type: Type.STRING }, hangul: { type: Type.STRING }, color: { type: Type.STRING }, element: { type: Type.STRING }, tenGod: { type: Type.STRING } } },
    branch: { type: Type.OBJECT, properties: { char: { type: Type.STRING }, hangul: { type: Type.STRING }, color: { type: Type.STRING }, element: { type: Type.STRING }, tenGod: { type: Type.STRING }, animal: { type: Type.STRING } } },
    shipseong: { type: Type.ARRAY, items: { type: Type.STRING } },
    unseong: { type: Type.STRING },
    sinsal: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

const manseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    userInfo: { type: Type.OBJECT, properties: { animal: { type: Type.STRING }, color: { type: Type.STRING }, element: { type: Type.STRING } } },
    pillars: { type: Type.OBJECT, properties: { year: pillarSchema, month: pillarSchema, day: pillarSchema, time: pillarSchema } },
    pillarAnalysis: { type: Type.OBJECT, properties: { year: { type: Type.STRING }, month: { type: Type.STRING }, day: { type: Type.STRING }, time: { type: Type.STRING } } },
    ohaeng: { type: Type.OBJECT, properties: { wood: { type: Type.NUMBER }, fire: { type: Type.NUMBER }, earth: { type: Type.NUMBER }, metal: { type: Type.NUMBER }, water: { type: Type.NUMBER }, missing: { type: Type.ARRAY, items: { type: Type.STRING } }, excess: { type: Type.ARRAY, items: { type: Type.STRING } } } },
    shipseong: { type: Type.OBJECT, properties: { bi: { type: Type.NUMBER }, sik: { type: Type.NUMBER }, jae: { type: Type.NUMBER }, gwan: { type: Type.NUMBER }, in: { type: Type.NUMBER } } },
    strength: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, label: { type: Type.STRING }, description: { type: Type.STRING } } },
    daewoon: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { age: { type: Type.NUMBER }, stem: { type: Type.STRING }, stemHangul: { type: Type.STRING }, branch: { type: Type.STRING }, branchHangul: { type: Type.STRING }, tenGod: { type: Type.STRING } } } },
    analysis: { type: Type.OBJECT, properties: { personality: { type: Type.STRING }, currentYearLuck: { type: Type.STRING }, advice: { type: Type.STRING } } }
  }
};

const samjaeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    userAnimal: { type: Type.STRING },
    currentStatus: { type: Type.STRING },
    years: {
      type: Type.OBJECT,
      properties: {
        deul: { type: Type.NUMBER },
        nul: { type: Type.NUMBER },
        nal: { type: Type.NUMBER }
      }
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        meaning: { type: Type.STRING },
        caution: { type: Type.ARRAY, items: { type: Type.STRING } },
        remedy: { type: Type.STRING }
      }
    },
    isGoodSamjae: { type: Type.BOOLEAN }
  }
};

// --- API Calls ---

export const getGeminiFortune = async (data: UserSajuData): Promise<ManseResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `정통 만세력 분석 요청: 이름 ${data.name}, ${data.birthDate} ${data.birthTime}, ${data.calendarType}, 출생지 ${data.birthRegion}.`,
    config: { responseMimeType: "application/json", responseSchema: manseSchema }
  });
  return JSON.parse(response.text) as ManseResult;
};

export const getChongunFortune = async (data: UserSajuData): Promise<ChongunResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `사주 총운 풀이: ${data.name}, ${data.birthDate}, ${data.calendarType}.`
  });
  return JSON.parse(response.text) as ChongunResult;
};

export const getGunghapFortune = async (user1: UserSajuData, user2: UserSajuData): Promise<GunghapResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `궁합 분석: ${user1.name} & ${user2.name}.`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text) as GunghapResult;
};

export const getLottoLuck = async (data: UserSajuData): Promise<LottoLuckResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `로또 행운 번호: ${data.name}, ${data.birthDate}.`
  });
  return JSON.parse(response.text) as LottoLuckResult;
};

export const getCelebMatch = async (data: UserSajuData): Promise<CelebMatchResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `연예인 찰떡궁합 추천: ${data.name}, ${data.birthDate}.`
  });
  return JSON.parse(response.text) as CelebMatchResult;
};

export const getTravelRecommendation = async (data: UserSajuData): Promise<TravelRecommendResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `행운의 여행지 추천: ${data.name}, ${data.birthDate}.`
  });
  return JSON.parse(response.text) as TravelRecommendResult;
};

export const getSamjaeFortune = async (data: UserSajuData): Promise<SamjaeResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    당신은 민속 신앙과 명리학에 해박한 무속인 컨설턴트입니다. 
    사용자의 정보를 바탕으로 '삼재(三災)'를 분석해주세요.
    현재 연도는 2025년(을사년)입니다.

    [사용자 정보]
    이름: ${data.name}, 생년월일: ${data.birthDate}, ${data.calendarType}

    [분석 가이드]
    1. 삼재 주기 계산:
       - 신자진(원숭이, 쥐, 용): 인묘진(호랑이, 토끼, 용) 연도가 삼재
       - 해묘미(돼지, 토끼, 양): 사오미(뱀, 말, 양) 연도가 삼재 (2025년 뱀띠해는 해묘미생에게 '들삼재'의 시작)
       - 인오술(범, 말, 개): 신유술(원숭이, 닭, 개) 연도가 삼재
       - 사유축(뱀, 닭, 소): 해자축(돼지, 쥐, 소) 연도가 삼재
    2. 현재 연도(2025년)가 사용자의 삼재 기간(들, 눌, 날) 중 어디에 해당하는지 명시하세요.
    3. '복삼재(福三災)' 여부 판단: 사용자의 사주 원국에서 2025년의 기운이 희신/용신으로 작용하면 화가 복으로 변하는 복삼재로 풀이하세요.
    4. 구체적인 조언: 사고, 건강, 인간관계 등에서 주의할 점과 액운을 막는 마음가짐(비방)을 제안하세요.

    반드시 JSON 스키마를 준수하여 출력하세요.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a mystical advisor specialized in Samjae. Provide accurate calculations and wise advice in Korean.",
      responseMimeType: "application/json",
      responseSchema: samjaeSchema,
      temperature: 0.7,
    },
  });

  if (response.text) return JSON.parse(response.text) as SamjaeResult;
  throw new Error("삼재 분석 실패");
};