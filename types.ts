export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
}

export enum CalendarType {
  SOLAR = '양력',
  LUNAR = '음력',
}

export interface UserSajuData {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or "unknown"
  calendarType: CalendarType;
}

export interface FortuneResult {
  yearTitle: string; // e.g., "을사년 (2025)"
  overall: string;
  wealth: string;
  love: string;
  health: string;
  career: string;
  luckyItems: string;
}

export enum AppState {
  WELCOME,
  INPUT,
  RITUAL, // Loading
  RESULT,
}