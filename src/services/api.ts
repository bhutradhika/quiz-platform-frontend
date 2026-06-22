import { API_BASE_URL, STORAGE_KEYS } from "@/constants/api";
import { ApiResponse } from "@/types";
import toast from "react-hot-toast";

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

  private shouldShowErrorToast(status: number, errorCode?: string): boolean {
    const clientErrorStatuses = [400, 403];
    const clientErrorCodes = ["VALIDATION_ERROR", "ACCESS_DENIED"];

    if (clientErrorStatuses.includes(status)) return true;
    if (errorCode && clientErrorCodes.includes(errorCode)) return true;
    return false;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      if (this.shouldShowErrorToast(response.status, data.errorCode)) {
        toast.error(data.message || "An error occurred");
      }

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
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return {
        success: false,
        data: null as T,
        message,
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
