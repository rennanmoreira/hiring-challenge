"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userApi } from "@/services/api";
import { message } from "antd";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar se há um token no localStorage ao iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await fetchUserData(storedToken);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        logout();
      }
    };
    
    loadUserData();
  }, []);

  const fetchUserData = async (authToken: string) => {
    try {
      const response = await userApi.me(authToken);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await userApi.login({ username, password });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      message.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please check your credentials.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
