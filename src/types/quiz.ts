import { QuestionType, QuizCategory, QuizLevel } from "@/types/enums";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  last: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  level: QuizLevel;
  isPublic: boolean;
  questionCount?: number;
  totalPoints?: number;
  pointsPerQuestion?: number;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean | null;
  orderIndex: number;
}

export interface CategoryStats {
  name: string;
  levels: LevelStats[];
}

export interface LevelStats {
  name: string;
  totalQuizzes: number;
}

export interface ChoiceRequest {
  text: string;
  isCorrect: boolean;
  orderIndex?: number;
}

export interface QuestionRequest {
  text: string;
  type: QuestionType;
  points: number;
  choices: ChoiceRequest[];
}

export interface QuizRequest {
  title: string;
  description?: string;
  category: QuizCategory;
  level?: QuizLevel;
  isPublic?: boolean;
}

export interface AdminStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCategories: number;
}
