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
  birthRegion: string; // Added birth region
}

// Ten Stems (Cheongan) and Twelve Branches (Jiji) structure
export interface Pillar {
  stem: { char: string; hangul: string; color: string; element: string; tenGod: string }; // 천간
  branch: { char: string; hangul: string; color: string; element: string; tenGod: string; animal: string }; // 지지
  shipseong: string[]; // 지장간 (Hidden stems) - simplified for display
  unseong: string; // 12 Unseong (12운성)
  sinsal: string[]; // Sinsal (신살)
}

export interface ManseResult {
  userInfo: {
    animal: string; // 띠
    color: string; // 띠 색상
    element: string; // 일간 오행 (Day Master)
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    time: Pillar;
  };
  pillarAnalysis: {
    year: string;  // 연주 풀이 (초년, 조상)
    month: string; // 월주 풀이 (청년, 부모/사회)
    day: string;   // 일주 풀이 (본인, 배우자)
    time: string;  // 시주 풀이 (말년, 자식)
  };
  ohaeng: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    missing: string[]; // 없는 오행
    excess: string[]; // 과다 오행
  };
  shipseong: {
    bi: number; // 비겁 (Friend/Self)
    sik: number; // 식상 (Output)
    jae: number; // 재성 (Wealth)
    gwan: number; // 관성 (Power)
    in: number; // 인성 (Resource)
  };
  strength: {
    score: number; // 0 (Very Weak) to 100 (Very Strong), 50 is Neutral
    label: string; // e.g., "신약", "중화", "신강"
    description: string;
  };
  daewoon: {
    age: number;
    stem: string;
    stemHangul: string; // 대운 천간 한글
    branch: string;
    branchHangul: string; // 대운 지지 한글
    tenGod: string; // 대운의 십성
  }[];
  analysis: {
    personality: string; // 성격 분석
    currentYearLuck: string; // 올해 운세
    advice: string; // 조언
  };
}

// New Interface for General Fortune (Chongun)
export interface ChongunResult {
  userName: string;
  summary: string; // 사주 총론 요약
  keywords: string[]; // 핵심 키워드 3~4개
  sections: {
    selfView: string;   // 내가 아는 내 모습
    othersView: string; // 남이 보는 내 모습
    talent: string;     // 타고난 재능과 적성
    wealth: string;     // 타고난 재물운
    love: string;       // 타고난 애정운
    work: string;       // 타고난 일복/직업
    health: string;     // 타고난 건강/인복
  };
  advice: string;
}

export enum AppState {
  WELCOME,
  HUB,      // New state for Main Menu
  INPUT,
  LOADING,
  RESULT,
}

export enum AppMode {
  MANSE,    // Classic Manse Chart
  CHONGUN,  // General Fortune Text
}