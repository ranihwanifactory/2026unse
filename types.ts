export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export enum CalendarType {
  SOLAR = '양력',
  LUNAR = '음력'
}

export interface UserInfo {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  calendarType: CalendarType;
}

export interface Pillar {
  heavenlyStem: string; // 천간 (e.g., 甲)
  earthlyBranch: string; // 지지 (e.g., 子)
  koreanStem: string; // 갑
  koreanBranch: string; // 자
  color: string; // Visual color hint (e.g., 'text-blue-400')
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface FortuneResult {
  userName: string;
  pillars: FourPillars;
  overallLuck: string;
  wealthLuck: string;
  careerLuck: string;
  loveLuck: string;
  healthLuck: string;
  luckyItems: string[];
  advice: string;
}

export enum AppState {
  INPUT,
  LOADING,
  RESULT,
  ERROR
}