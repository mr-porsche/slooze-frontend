import type { User, UserRole } from '@/types/user';
import { createContext } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => { success: boolean; message: string };
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => { success: boolean; message: string };
  getAllUsers: () => User[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
