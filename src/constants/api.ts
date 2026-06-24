export const API_BASE_URL =
  "https://9nzuts7x4c.execute-api.eu-north-1.amazonaws.com/proxy";

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
  },
  ATTEMPT: {
    START: (quizId: string) => `/api/attempts/start/${quizId}`,
    INCOMPLETE: (quizId: string) => `/api/attempts/incomplete/${quizId}`,
    SUBMIT_ANSWER: (attemptId: string) => `/api/attempts/${attemptId}/answers`,
    GET_ANSWERS: (attemptId: string) => `/api/attempts/${attemptId}/answers`,
    COMPLETE: (attemptId: string) => `/api/attempts/${attemptId}/complete`,
    MY_ATTEMPTS: "/api/attempts",
    BY_ID: (attemptId: string) => `/api/attempts/${attemptId}`,
    COMPLETED_QUIZZES: "/api/attempts/completed-quizzes",
  },
  FEED: {
    DASHBOARD_STATS: "/api/feed/dashboard/stats",
    LEADERBOARD: "/api/feed/leaderboard",
    LEADERBOARD_BY_QUIZ: (quizId: string) => `/api/feed/leaderboard/${quizId}`,
  },
  ADMIN: {
    CREATE_QUIZ: "/api/admin/quizzes",
    UPDATE_QUIZ: (id: string) => `/api/admin/quizzes/${id}`,
    DELETE_QUIZ: (id: string) => `/api/admin/quizzes/${id}`,
    ADD_QUESTION: (quizId: string) => `/api/admin/quizzes/${quizId}/questions`,
    STATS: "/api/admin/quizzes/stats",
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;
