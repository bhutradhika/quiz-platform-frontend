import { API_ENDPOINTS } from "@/constants/api";
import { AnswerResponse, AnswerSubmission, Attempt, DashboardStats, PagedResponse } from "@/types";
import { apiClient } from "./api";

export const attemptService = {
  startAttempt: async (quizId: string) => {
    return apiClient.post<Attempt>(API_ENDPOINTS.ATTEMPT.START(quizId), {}, true);
  },

  getIncompleteAttempt: async (quizId: string) => {
    return apiClient.get<Attempt>(API_ENDPOINTS.ATTEMPT.INCOMPLETE(quizId), true);
  },

  submitAnswer: async (attemptId: string, data: AnswerSubmission) => {
    return apiClient.post<AnswerResponse>(
      API_ENDPOINTS.ATTEMPT.SUBMIT_ANSWER(attemptId),
      data,
      true,
    );
  },

  getAttemptAnswers: async (attemptId: string) => {
    return apiClient.get<AnswerResponse[]>(API_ENDPOINTS.ATTEMPT.GET_ANSWERS(attemptId), true);
  },

  completeAttempt: async (attemptId: string) => {
    return apiClient.post<Attempt>(API_ENDPOINTS.ATTEMPT.COMPLETE(attemptId), {}, true);
  },

  getMyAttempts: async (page = 0, size = 10) => {
    return apiClient.get<PagedResponse<Attempt>>(
      `${API_ENDPOINTS.ATTEMPT.MY_ATTEMPTS}?page=${page}&size=${size}`,
      true,
    );
  },

  getAttemptById: async (attemptId: string) => {
    return apiClient.get<Attempt>(API_ENDPOINTS.ATTEMPT.BY_ID(attemptId), true);
  },

  getDashboardStats: async () => {
    return apiClient.get<DashboardStats>(API_ENDPOINTS.ATTEMPT.DASHBOARD_STATS, true);
  },

  getCompletedQuizIds: async () => {
    return apiClient.get<string[]>(API_ENDPOINTS.ATTEMPT.COMPLETED_QUIZZES, true);
  },
};
