import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserSajuData, ManseResult, ChongunResult, GunghapResult, LottoLuckResult, CelebMatchResult } from "../types";

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

// --- Schema definitions for LottoLuckResult ---
const lottoLuckSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    luckyNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "Array of 6 lucky numbers (1-45)" },
    luckyColor: { type: Type.STRING },
    direction: { type: Type.STRING },
    reason: { type: Type.STRING, description: "Reasoning based on Saju elements" }
  }
};

// --- Schema definitions for CelebMatchResult ---
const celebMatchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    celebrityName: { type: Type.STRING, description: "Name of the matching celebrity" },
    celebrityJob: { type: Type.STRING },
    compatibilityScore: { type: Type.NUMBER },
    matchReason: { type: Type.STRING, description: "Why they fit based on Saju logic" },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    userElement: { type: Type.STRING, description: "User's Day Master element" },
    celebElement: { type: Type.STRING, description: "Celebrity's presumed element" }
  }
};


// --- API Calls ---

export const getGeminiFortune = async (data: UserSajuData): Promise<ManseResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 대한민국 최고의 정통 사주 명리학 대가입니다. 만세력(Saju Manse) 계산의 **정확도**가 가장 중요합니다.

    [사용자 입력 데이터]
    이름: ${data.name}
    성별: ${data.gender}
    입력 생년월일: ${data.birthDate} (YYYY-MM-DD 형식)
    입력 시간: ${data.birthTime} (24시간 형식)
    달력 구분: ${data.calendarType} (음력, 양력, 윤달)
    출생지: ${data.birthRegion}

    [만세력 계산 필수 정밀 규칙 - 매우 중요!]
    1. **음양력 변환**: 
       - 입력된 날짜가 '음력' 또는 '윤달'이라면, 해당 연도의 **정확한 양력 날짜**로 변환한 후 사주를 계산하십시오. 
       - 예: 1980년 음력 1월 1일은 양력 1980년 2월 16일입니다. 이 변환을 틀리면 모든 사주가 틀립니다.
    2. **절기(Solar Term) 기준 월주 산정**: 
       - 월주(Month Pillar)는 양력/음력 달이 바뀌는 날이 아니라, **24절기**의 절입 시각(입춘, 경칩, 청명 등)을 기준으로 바뀝니다.
       - 예: 양력 2월 4일 전후의 입춘 시각을 정확히 따져, 입춘 전이면 전년도의 연주/월주를, 입춘 후면 새해의 연주/월주를 사용하십시오.
    3. **시주(Time Pillar) 보정 (한국 표준시)**:
       - 한국의 경도(약 127.5도)를 고려하여, 표준시보다 약 30분을 늦춰서 시주를 계산하십시오.
       - 자시(Rat): 23:30 ~ 01:29
       - 축시(Ox): 01:30 ~ 03:29
       - ... (2시간 간격)
       - **야자시/조자시 처리**: 현대 명리학의 보편적 견해에 따라 23:30분이 넘어가면 **다음 날의 일주(Day Pillar)**를 적용하십시오. (조자시 적용 권장)
    4. **천간/지지 및 십성**: 계산된 4주 8글자에 대한 정확한 한자, 한글 독음, 그리고 일간 대비 십성(육친)을 매핑하십시오.

    [분석 요구사항]
    위 규칙으로 계산된 사주 원국을 바탕으로:
    1. 정확한 4기둥 정보.
    2. 오행의 과다/결핍 및 신강/신약 분석.
    3. 대운(10년 주기 운)의 흐름 계산 (만 나이 기준).
    4. 2025년(을사년)의 신년 운세를 사주 원국과 대조하여 구체적으로 풀이.

    JSON 스키마를 엄격히 준수하여 데이터를 반환하십시오.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are an expert Saju Master. Use precise astronomical algorithms for Solar Terms and Lunar-Solar conversion. Return only pure JSON.",
      responseMimeType: "application/json",
      responseSchema: manseSchema,
      temperature: 0.2, // Lower temperature for more accurate calculations
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
    사용자 정보를 바탕으로 사주 원국을 **정밀하게 계산**하고, 인생의 총운을 상세하게 풀이해주세요.
    
    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate} (${data.calendarType})
    시간: ${data.birthTime}
    출생지: ${data.birthRegion}

    [사주 계산 주의사항]
    - **음력 입력 시 반드시 정확한 양력 변환 후** 사주를 세우세요.
    - **절기(입춘 등) 기준**으로 연주와 월주를 정확히 판단하세요.
    - 한국 시간 기준 **30분 보정(23:30 기준 자시)**을 적용하세요.

    [필수 포함 내용]
    1. 사주 총론 요약
    2. 나를 표현하는 키워드 3~4개
    3. 상세 풀이: 내면, 외면, 재능, 재물, 애정, 직업, 인복
    4. 따뜻한 조언

    JSON 스키마를 준수하여 데이터를 반환하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a wise Saju fortune teller. Calculate pillars accurately before interpreting. Provide detailed Korean text.",
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
    당신은 궁합 전문 사주가입니다. 두 사람의 사주를 **정밀하게 계산**하여 궁합을 봐주세요.

    [사용자 1 (본인)]
    이름: ${user1.name}, 성별: ${user1.gender}, 생년월일: ${user1.birthDate} ${user1.birthTime}, ${user1.calendarType}

    [사용자 2 (상대방)]
    이름: ${user2.name}, 성별: ${user2.gender}, 생년월일: ${user2.birthDate} ${user2.birthTime}, ${user2.calendarType}

    [계산 주의사항]
    - 각각의 생년월일이 음력이라면 **양력으로 정확히 변환**하세요.
    - 절기(입춘 등)를 고려하여 정확한 연주/월주를 산출하세요.
    - 정확한 사주 원국 비교를 통해 궁합을 분석해야 합니다.

    [요구 사항]
    1. 궁합 점수(0~100점)
    2. 성격, 가치관, 연애 스타일, 갈등 해결 방식 분석
    3. 장점 3가지, 주의점 3가지
    4. 조언
    
    JSON 스키마를 엄격히 준수하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a Saju compatibility expert. Calculate both charts accurately first.",
      responseMimeType: "application/json",
      responseSchema: gunghapSchema,
      temperature: 0.5,
    },
  });

  if (response.text) return JSON.parse(response.text) as GunghapResult;
  throw new Error("궁합 분석 실패");
};

export const getLottoLuck = async (data: UserSajuData): Promise<LottoLuckResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    당신은 사주와 수비학 전문가입니다. 사용자 정보를 바탕으로 로또(1~45) 행운의 숫자를 추천해주세요.

    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate} ${data.birthTime}, ${data.calendarType}
    
    [주의]
    - 음력일 경우 양력으로 변환하여 정확한 사주(용신/희신)를 파악하세요.
    
    [요구사항]
    1. 사용자의 사주(용신/희신)에 부족한 기운을 채워주는 숫자 6개를 추천하세요 (1~45 범위).
    2. 행운의 색상과 방위를 알려주세요.
    3. 이 숫자들이 왜 행운인지 사주학적 근거를 짧게 설명하세요.

    JSON 스키마를 준수하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a Numerology and Saju expert. Return JSON data.",
      responseMimeType: "application/json",
      responseSchema: lottoLuckSchema,
      temperature: 0.8,
    },
  });

  if (response.text) return JSON.parse(response.text) as LottoLuckResult;
  throw new Error("로또 번호 추천 실패");
};

export const getCelebMatch = async (data: UserSajuData): Promise<CelebMatchResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const oppositeGender = data.gender === '남성' ? '여성' : '남성';

  const prompt = `
    당신은 사주 궁합 전문 커플매니저입니다. 
    사용자의 사주(일간, 부족한 오행, 기질)를 분석하여, 
    가장 찰떡궁합인 **한국 유명 연예인(${oppositeGender})**을 한 명 추천해주세요.
    
    [사용자 정보]
    이름: ${data.name}
    성별: ${data.gender}
    생년월일: ${data.birthDate} (${data.calendarType})
    시간: ${data.birthTime}

    [매칭 로직]
    1. 사용자의 일간(Day Master)과 오행 구조를 파악하세요.
    2. 사용자에게 부족한 기운을 가지고 있거나, 천간합/지지합이 되는 유명한 한국 연예인(${oppositeGender})을 선택하세요.
    3. 연예인의 사주 정보는 당신이 가진 학습 데이터를 바탕으로 추정하여 판단하세요.

    [요구사항]
    1. 추천 연예인 이름과 직업
    2. 궁합 점수 (0-100)
    3. 사주학적 추천 이유 (예: 당신은 불의 기운이 강해 물의 기운을 가진 OOO과 잘 맞습니다.)
    4. 두 사람의 케미를 나타내는 키워드 3개

    JSON 스키마를 준수하세요.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a K-Saju Matchmaker. Recommend a famous Korean celebrity of the opposite gender based on Saju compatibility.",
      responseMimeType: "application/json",
      responseSchema: celebMatchSchema,
      temperature: 0.7,
    },
  });

  if (response.text) return JSON.parse(response.text) as CelebMatchResult;
  throw new Error("연예인 매칭 실패");
};
