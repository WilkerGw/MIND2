"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// A URL da API agora vem da nossa variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no login');
      }
      const { token } = await response.json();
      sessionStorage.setItem('authToken', token);
      setToken(token);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}