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

export enum AppState {
  WELCOME,
  INPUT,
  LOADING,
  RESULT,
}