
export enum AppStage {
  ROLE_SELECTION = 'ROLE_SELECTION',
  SCENARIO_SELECTION = 'SCENARIO_SELECTION',
  INTERACTION = 'INTERACTION',
  FEEDBACK = 'FEEDBACK',
}

export type Language = 'en' | 'zh';

export interface Role {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  iconName: 'Baby' | 'Users' | 'Briefcase';
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Challenging';

export interface Scenario {
  id: string;
  roleId: string;
  title: string;
  titleZh: string;
  difficulty: DifficultyLevel;
  description: string;
  context: string; // The situation description shown to user
  aiContext: string; // Hidden context for the AI (NEL framework rules)
  initialMessage?: string;
  tags: string[]; // e.g. "Home-School Partnership", "Child Observation"
  mode: 'text'; // Pure text interaction
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode: 'text' | 'selection';
  options?: string[]; // For MCQ style interactions
  timestamp: number;
}

export interface FeedbackData {
  languageProficiency: {
    score: number;
    comment: string;
  };
  nelAlignment: {
    score: number; // 1-5
    comment: string;
  };
  strengths: string[];
  suggestions: string[];
}
