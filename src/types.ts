export interface CardItem {
  emoji: string;
  title: string;
  subtitle?: string;
  soundText?: string;
  badge?: string;
}

export interface Question {
  question: string;
  emoji?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SubjectCategory {
  id: string;
  title: string;
  emoji?: string;
  cards: CardItem[];
  infoBox?: string;
}

export interface ProcedureStep {
  step: number;
  title: string;
  desc: string;
  emoji: string;
  tip?: string;
}

export interface StepProcedure {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  steps: ProcedureStep[];
}

export interface Subject {
  id: string;
  name: string;
  englishName: string;
  emoji: string;
  color: string;
  bgLight: string;
  accentColor: string;
  description: string;
  note: string;
  lang: 'th-TH' | 'en-US';
  hasDraw?: boolean;
  isSpecialEnglish?: boolean;
  categories?: SubjectCategory[];
  cards?: CardItem[];
  questions?: Question[];
  procedures?: StepProcedure[];
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredStars: number;
}

export interface SubjectStat {
  subjectId: string;
  studyCount: number;
  quizTotal: number;
  quizCorrect: number;
  starsEarned: number;
  lastStudied?: string;
}

export interface UserStats {
  totalStars: number;
  subjects: Record<string, SubjectStat>;
}
