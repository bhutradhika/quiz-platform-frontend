import { API_BASE_URL, STORAGE_KEYS } from "@/constants/api";
import { ApiResponse } from "@/types";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${STORAGE_KEYS.TOKEN}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null as T,
        message: data.message || "An error occurred",
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
      };
    }

    return data;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, requiresAuth = false } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  get<T>(endpoint: string, requiresAuth = false) {
    return this.request<T>(endpoint, { method: "GET", requiresAuth });
  }

  post<T>(endpoint: string, body: unknown, requiresAuth = false) {
    return this.request<T>(endpoint, { method: "POST", body, requiresAuth });
  }

  put<T>(endpoint: string, body: unknown, requiresAuth = true) {
    return this.request<T>(endpoint, { method: "PUT", body, requiresAuth });
  }

  delete<T>(endpoint: string, requiresAuth = true) {
    return this.request<T>(endpoint, { method: "DELETE", requiresAuth });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
