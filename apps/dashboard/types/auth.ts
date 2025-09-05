// types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  teamName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  user?: User;
}
