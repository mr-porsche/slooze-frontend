import type { User, UserRole } from '@/types/user';
import {
  getCurrentUser,
  initializeAuth,
  loginUser as authLogin,
  registerUser as authRegister,
  logoutUser as authLogout,
  updateUserRole as authUpdateUserRole,
  getUsers,
} from '@/utils/auth';
import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize auth system and get current user in one go
  const [user, setUser] = useState<User | null>(() => {
    initializeAuth();
    return getCurrentUser();
  });

  const login = (email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const register = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const result = authRegister(firstName, lastName, email, password, role);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const result = authUpdateUserRole(userId, newRole);
    if (result.success) {
      // Refresh user list if needed
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        setUser(currentUser);
      }
    }
    return result;
  };

  const getAllUsers = () => {
    return getUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserRole,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
