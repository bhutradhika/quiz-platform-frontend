import { API_ENDPOINTS } from "@/constants/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";
import { apiClient } from "./api";

export const authService = {
  login: async (data: LoginRequest) => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: async (data: RegisterRequest) => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  },
};
