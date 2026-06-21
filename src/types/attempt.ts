export interface Attempt {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  level: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  startedAt: string;
  completedAt: string | null;
}

export interface AnswerSubmission {
  questionId: string;
  choiceId: string;
}

export interface AnswerResponse {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  correctChoiceId: string;
}

export interface DashboardStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
}
