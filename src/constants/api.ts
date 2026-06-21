export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/public/auth/login",
    REGISTER: "/api/public/auth/register",
  },
  QUIZ: {
    LIST: "/api/quizzes",
    BY_ID: (id: string) => `/api/quizzes/${id}`,
    CATEGORIES: "/api/quizzes/categories",
    CATEGORIES_STATS: "/api/quizzes/categories/stats",
    LEVELS: "/api/quizzes/levels",
    LEADERBOARD: (id: string) => `/api/quizzes/${id}/leaderboard`,
  },
  ATTEMPT: {
    START: (quizId: string) => `/api/quizzes/${quizId}/attempts`,
    INCOMPLETE: (quizId: string) => `/api/quizzes/${quizId}/attempts/incomplete`,
    SUBMIT_ANSWER: (attemptId: string) => `/api/quizzes/attempts/${attemptId}/answers`,
    GET_ANSWERS: (attemptId: string) => `/api/quizzes/attempts/${attemptId}/answers`,
    COMPLETE: (attemptId: string) => `/api/quizzes/attempts/${attemptId}/complete`,
    MY_ATTEMPTS: "/api/quizzes/attempts",
    BY_ID: (attemptId: string) => `/api/quizzes/attempts/${attemptId}`,
    DASHBOARD_STATS: "/api/quizzes/dashboard/stats",
    COMPLETED_QUIZZES: "/api/quizzes/completed",
  },
  ADMIN: {
    CREATE_QUIZ: "/api/admin/quizzes",
    UPDATE_QUIZ: (id: string) => `/api/admin/quizzes/${id}`,
    DELETE_QUIZ: (id: string) => `/api/admin/quizzes/${id}`,
    ADD_QUESTION: (quizId: string) => `/api/admin/quizzes/${quizId}/questions`,
    STATS: "/api/quizzes/admin/stats",
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;
