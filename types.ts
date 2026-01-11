export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
}

export enum CalendarType {
  SOLAR = '양력',
  LUNAR = '음력',
  LEAP = '윤달',
}

export interface UserSajuData {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or "unknown"
  calendarType: CalendarType;
  birthRegion: string;
}

export interface Pillar {
  stem: { char: string; hangul: string; color: string; element: string; tenGod: string };
  branch: { char: string; hangul: string; color: string; element: string; tenGod: string; animal: string };
  shipseong: string[];
  unseong: string;
  sinsal: string[];
}

export interface ManseResult {
  userInfo: {
    animal: string;
    color: string;
    element: string;
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    time: Pillar;
  };
  pillarAnalysis: {
    year: string;
    month: string;
    day: string;
    time: string;
  };
  ohaeng: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    missing: string[];
    excess: string[];
  };
  shipseong: {
    bi: number;
    sik: number;
    jae: number;
    gwan: number;
    in: number;
  };
  strength: {
    score: number;
    label: string;
    description: string;
  };
  daewoon: {
    age: number;
    stem: string;
    stemHangul: string;
    branch: string;
    branchHangul: string;
    tenGod: string;
  }[];
  analysis: {
    personality: string;
    currentYearLuck: string;
    advice: string;
  };
}

export interface ChongunResult {
  userName: string;
  summary: string;
  keywords: string[];
  sections: {
    selfView: string;
    othersView: string;
    talent: string;
    wealth: string;
    love: string;
    work: string;
    health: string;
  };
  advice: string;
}

export interface GunghapResult {
  score: number;
  summary: string;
  details: {
    personalityMatch: string;
    valueMatch: string;
    loveStyle: string;
    conflictResolution: string;
  };
  goodPoints: string[];
  badPoints: string[];
  advice: string;
}

export interface LottoLuckResult {
  luckyNumbers: number[];
  luckyColor: string;
  direction: string;
  reason: string;
}

export interface CelebMatchResult {
  celebrityName: string;
  celebrityJob: string;
  compatibilityScore: number;
  matchReason: string;
  keywords: string[];
  userElement: string;
  celebElement: string;
}

export interface TravelRecommendResult {
  elementAnalysis: string;
  domestic: {
    place: string;
    location: string;
    reason: string;
    activity: string;
  };
  international: {
    place: string;
    country: string;
    reason: string;
    activity: string;
  };
  travelTip: string;
}

export interface SamjaeResult {
  userAnimal: string;
  currentStatus: string; // e.g., "삼재 아님", "들삼재", "눌삼재", "날삼재"
  years: {
    deul: number; // 들삼재 연도
    nul: number;  // 눌삼재 연도
    nal: number;  // 날삼재 연도
  };
  analysis: {
    meaning: string; // 해당 삼재의 의미 (복삼재, 평삼재, 악삼재 구분 포함)
    caution: string[]; // 주의해야 할 점 3가지
    remedy: string; // 액막이 비방 및 마음가짐
  };
  isGoodSamjae: boolean; // 복삼재 여부
}

export enum AppState {
  WELCOME,
  AUTH,
  PROFILE,
  HUB,
  INPUT,
  LOADING,
  RESULT,
}

export enum AppMode {
  MANSE,
  CHONGUN,
  GUNGHAP,
  LOTTO,
  CELEB_MATCH,
  TRAVEL,
  SAMJAE
}