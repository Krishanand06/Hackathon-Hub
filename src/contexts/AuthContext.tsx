import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => void;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const persistSession = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true });
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    persistSession('demo-token', {
      id: 1,
      username: email.split('@')[0] || 'demo_user',
      email,
      fullName: email === 'demo@bits.edu' ? 'Demo Student' : 'BITS Student',
      role: 'STUDENT',
      skills: ['React', 'Node.js', 'Python'],
      bio: 'BITS Pilani CS student',
    });
  };

  const loginDemo = () => {
    const token = 'demo-token';
    const user: User = {
      id: 1,
      username: 'demo_user',
      email: 'demo@bits.edu',
      fullName: 'Demo Student',
      role: 'STUDENT',
      skills: ['React', 'Node.js', 'Python'],
      bio: 'BITS Pilani CS student',
    };
    persistSession(token, user);
  };

  const register = async (data: RegisterData) => {
    persistSession('demo-token', {
      id: Date.now(),
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: (data.role as User['role']) ?? 'STUDENT',
      skills: [],
      bio: '',
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, isAuthenticated: false });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, loginDemo, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
