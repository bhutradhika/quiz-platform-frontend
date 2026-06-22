import { API_ENDPOINTS } from "@/constants/api";
import {
  AdminStats,
  CategoryStats,
  LeaderboardEntry,
  PagedResponse,
  Quiz,
  QuizCategory,
  QuizLevel,
} from "@/types";
import { apiClient } from "./api";

export const quizService = {
  getQuizzes: async (page = 0, size = 10, category?: string, level?: string) => {
    let endpoint = `${API_ENDPOINTS.QUIZ.LIST}?page=${page}&size=${size}`;
    if (category) {
      endpoint += `&category=${category}`;
    }
    if (level) {
      endpoint += `&level=${level}`;
    }
    return apiClient.get<PagedResponse<Quiz>>(endpoint, true);
  },

  getQuizById: async (id: string, showAnswers = false) => {
    return apiClient.get<Quiz>(`${API_ENDPOINTS.QUIZ.BY_ID(id)}?showAnswers=${showAnswers}`, true);
  },

  getCategories: async () => {
    return apiClient.get<QuizCategory[]>(API_ENDPOINTS.QUIZ.CATEGORIES, true);
  },

  getCategoryStats: async () => {
    return apiClient.get<CategoryStats[]>(API_ENDPOINTS.QUIZ.CATEGORIES_STATS, true);
  },

  getLevels: async () => {
    return apiClient.get<QuizLevel[]>(API_ENDPOINTS.QUIZ.LEVELS, true);
  },

  getLeaderboard: async (quizId: string, limit = 10) => {
    return apiClient.get<LeaderboardEntry[]>(
      API_ENDPOINTS.FEED.LEADERBOARD(quizId) + `?limit=${limit}`,
      true,
    );
  },

  getAdminStats: async () => {
    return apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS, true);
  },
};
