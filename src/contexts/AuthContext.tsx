import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role?: DemoRole) => void;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

type DemoRole = 'STUDENT' | 'MENTOR' | 'JUDGE' | 'ADMIN';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const demoUsers: Record<DemoRole, User> = {
  STUDENT: {
    id: 2,
    username: 'demo_user',
    email: 'demo@bits.edu',
    fullName: 'Demo Student',
    role: 'STUDENT',
    skills: ['React', 'Node.js', 'Python'],
    bio: 'BITS Pilani CS student',
  },
  MENTOR: {
    id: 201,
    username: 'dr_ravi',
    email: 'mentor@bits.edu',
    fullName: 'Dr. Ravi Shankar',
    role: 'MENTOR',
    skills: ['Machine Learning', 'Python', 'Computer Vision'],
    bio: 'Industry mentor for AI and ML teams',
  },
  JUDGE: {
    id: 3,
    username: 'judge_isha',
    email: 'judge@bits.edu',
    fullName: 'Isha Nair',
    role: 'JUDGE',
    skills: ['Product', 'Impact', 'Presentation'],
    bio: 'Hackathon judge and product mentor',
  },
  ADMIN: {
    id: 1,
    username: 'admin',
    email: 'admin@bits.edu',
    fullName: 'System Admin',
    role: 'ADMIN',
    skills: ['Operations', 'Review', 'Platform Admin'],
    bio: 'Platform administrator',
  },
};

const demoEmailMap: Record<string, DemoRole> = {
  'demo@bits.edu': 'STUDENT',
  'student@bits.edu': 'STUDENT',
  'mentor@bits.edu': 'MENTOR',
  'judge@bits.edu': 'JUDGE',
  'admin@bits.edu': 'ADMIN',
};

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

    try {
      const response = await authApi.login({ email, password });
      persistSession(response.data.token, response.data.user);
      return;
    } catch {
      // Fall back to demo personas while the local API/database is not running.
    }

    const demoRole = demoEmailMap[email.toLowerCase()];
    if (demoRole) {
      persistSession(`demo-${demoRole.toLowerCase()}-token`, demoUsers[demoRole]);
      return;
    }

    persistSession('demo-student-token', {
      ...demoUsers.STUDENT,
      // Use the valid demo student ID instead of Date.now() to prevent foreign key errors in backend
      id: 2,
      username: email.split('@')[0] || 'demo_user',
      email,
      fullName: 'BITS Student',
    });
  };

  const loginDemo = (role: DemoRole = 'STUDENT') => {
    persistSession(`demo-${role.toLowerCase()}-token`, demoUsers[role]);
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      persistSession(response.data.token, response.data.user);
      return;
    } catch (err) {
      // Fallback
    }

    persistSession('demo-token', {
      id: 2, // Use a valid database ID for demo testing
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
