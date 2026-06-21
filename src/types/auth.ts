import { UserRole } from "@/types/enums";

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
