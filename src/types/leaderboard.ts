export interface LeaderboardEntry {
  rank: number;
  attemptId: string;
  username: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
}
