import type { User, UserRole } from '@/types/user';

const USERS_KEY = 'cms_users';
const CURRENT_USER_KEY = 'cms_current_user';

// Default ADMIN user
const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@slooze.com',
  password: 'admin123', // Hashed inn production
  role: 'Admin',
  createdAt: new Date().toISOString(),
};

// Initialize localStorage with default ADMIN
export function initializeAuth() {
  const users = getUsers();
  if (users.length === 0) {
    saveUsers([DEFAULT_ADMIN]);
  }
}

// Getting all users from localStorage
export function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Saving users to localStorage
export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
export function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
): { success: boolean; message: string; user?: User } {
  const users = getUsers();

  // Checking if user already exists
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'User with this email already exists' };
  }

  // If not then creating a new one
  const newUser: User = {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    password, // Hashed inn production
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Registration successful', user: newUser };
}

// Login user
export function loginUser(
  email: string,
  password: string
): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Incorrect email or password' };
  }

  setCurrentUser(user);
  return { success: true, message: 'Login successful', user };
}

// Setting current user in localStorage
export function setCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Getting current user from localStorage
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Logout user
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Updating user role - only ADMIN
export function updateUserRole(
  userId: string,
  newRole: UserRole
): { success: boolean; message: string } {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  // Prevent changing ADMIN role
  if (users[userIndex].email === 'admin@slooze.com') {
    return { success: false, message: 'Cannot change admin role' };
  }

  users[userIndex].role = newRole;
  saveUsers(users);

  return { success: true, message: 'Role updated successfully' };
}
