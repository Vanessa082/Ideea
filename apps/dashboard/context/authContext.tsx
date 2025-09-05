"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { User, LoginData, AuthResponse, RegisterData } from "../types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "SET_AUTHENTICATED"; payload: boolean };

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log(`authReducer: ${action.type}`, { state, action });
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "LOGOUT":
      return { user: null, isLoading: false, isAuthenticated: false };
    default:
      return state;
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";

const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const USER_STORAGE_KEY = "user";

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      return { success: true, ...result };
    } catch (error) {
      console.error("register: error:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Verification failed");
      }
      if (result.accessToken && result.user) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, result.accessToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
        dispatch({ type: "SET_USER", payload: result.user });
      }
      return result;
    } catch (error) {
      console.error("verifyEmail: error:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
      if (result.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, result.accessToken);
        const decoded = decodeJWT(result.accessToken);
        if (decoded) {
          const user: User = {
            id: decoded.sub,
            username: decoded.username,
            email: decoded.email,
          };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          dispatch({ type: "SET_USER", payload: user });
        }
      }
      return result;
    } catch (error) {
      console.error("login: error:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const resendVerificationCode = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Resend failed");
      }
      return result;
    } catch (error) {
      console.error("resendVerificationCode: error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // With the new approach, we don't need a backend call for logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check for a saved user and token
      const savedUserString = localStorage.getItem(USER_STORAGE_KEY);
      const savedAccessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

      if (savedUserString && savedAccessToken) {
        try {
          const user: User = JSON.parse(savedUserString);
          dispatch({ type: "SET_USER", payload: user });
        } catch (e) {
          // If stored user is invalid, clear it
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }

      dispatch({ type: "SET_LOADING", payload: false });
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
