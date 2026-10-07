import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getAuthToken, clearAuthToken } from '../services/api';

export interface DemoAccountInfo {
  role: UserRole;
  email: string;
  pass: string;
  label: string;
  expectedRoute: '/dashboard' | '/admin';
}

export const DEMO_ACCOUNTS_MAP: Record<UserRole, DemoAccountInfo> = {
  STUDENT: {
    role: 'STUDENT',
    email: 'student@whisperledger.local',
    pass: 'Student@123',
    label: 'Student (Alex Chen)',
    expectedRoute: '/dashboard',
  },
  HOD: {
    role: 'HOD',
    email: 'hod@whisperledger.local',
    pass: 'Admin@123',
    label: 'HOD (Dr. Ramesh Kumar)',
    expectedRoute: '/admin',
  },
  DEAN: {
    role: 'DEAN',
    email: 'dean@whisperledger.local',
    pass: 'Admin@123',
    label: 'Dean (Prof. Sunita Deshmukh)',
    expectedRoute: '/admin',
  },
  GRIEVANCE_COMMITTEE: {
    role: 'GRIEVANCE_COMMITTEE',
    email: 'committee@whisperledger.local',
    pass: 'Admin@123',
    label: 'Grievance Committee',
    expectedRoute: '/admin',
  },
  ADMIN: {
    role: 'ADMIN',
    email: 'admin@whisperledger.local',
    pass: 'Admin@123',
    label: 'System Administrator',
    expectedRoute: '/admin',
  },
};

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    department: string;
    year: string;
    password: string;
    role?: string;
  }) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getCurrentUser();
        if (res && res.user && res.user.role) {
          setUser(res.user);
        } else {
          clearAuthToken();
          setUser(null);
        }
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    department: string;
    year: string;
    password: string;
    role?: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const switchDemoRole = async (targetRole: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const target = DEMO_ACCOUNTS_MAP[targetRole];
      const res = await api.login(target.email, target.pass);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const role: UserRole | null = user ? user.role : null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
