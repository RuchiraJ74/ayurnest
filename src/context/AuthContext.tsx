
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user type
type User = {
  id: string;
  username: string;
  email: string;
  dosha?: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha' | undefined;
  joinDate?: string;
};

// Define context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserDosha: (dosha: string) => void;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (username?: string, email?: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user type
type MockUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  dosha?: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';
  joinDate?: string;
};

// Mock users data (simulating backend)
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123',
    dosha: 'vata-pitta',
    joinDate: '2023-04-15',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('ayurnest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        dosha: foundUser.dosha,
        joinDate: foundUser.joinDate,
      };
      setUser(userData);
      localStorage.setItem('ayurnest_user', JSON.stringify(userData));
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid credentials");
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  // Mock signup functionality
  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error("Email already in use");
      throw new Error('Email already in use');
    }
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newUser: MockUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      joinDate: currentDate,
    };
    
    // In a real app, this would be a server-side operation
    MOCK_USERS.push(newUser);
    
    const userData: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      joinDate: newUser.joinDate,
    };
    
    setUser(userData);
    localStorage.setItem('ayurnest_user', JSON.stringify(userData));
    toast.success("Account created successfully!");
    setLoading(false);
  };

  // Logout functionality
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayurnest_user');
    toast.success("Logged out successfully");
  };

  // Update user's dosha
  const updateUserDosha = (dosha: string) => {
    if (user) {
      const updatedUser: User = { 
        ...user, 
        dosha: dosha as 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha' 
      };
      setUser(updatedUser);
      localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
      toast.success("Dosha updated successfully");
    }
  };
  
  // Reset password functionality
  const resetPassword = async (email: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = MOCK_USERS.some(u => u.email === email);
    
    if (!userExists) {
      toast.error("No account found with this email");
      throw new Error('No account found with this email');
    }
    
    // In a real app, this would send a password reset email
    toast.success("Password reset link sent to your email");
    setLoading(false);
  };
  
  // Update user profile
  const updateUserProfile = async (username?: string, email?: string) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      throw new Error('You must be logged in to update your profile');
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate and update the user profile in the database
    const updatedUser = { ...user };
    
    if (username) {
      updatedUser.username = username;
    }
    
    if (email) {
      // Check if email is already in use by another user
      if (email !== user.email && MOCK_USERS.some(u => u.email === email)) {
        setLoading(false);
        toast.error("Email is already in use");
        throw new Error('Email is already in use');
      }
      updatedUser.email = email;
    }
    
    // Update mock user data
    const mockUserIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (mockUserIndex !== -1) {
      if (username) MOCK_USERS[mockUserIndex].username = username;
      if (email) MOCK_USERS[mockUserIndex].email = email;
    }
    
    setUser(updatedUser);
    localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
    setLoading(false);
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      toast.error("You must be logged in to change your password");
      throw new Error('You must be logged in to change your password');
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the user in mock data and verify current password
    const mockUserIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (mockUserIndex === -1 || MOCK_USERS[mockUserIndex].password !== currentPassword) {
      setLoading(false);
      toast.error("Current password is incorrect");
      throw new Error('Current password is incorrect');
    }
    
    // Update the password in mock data
    MOCK_USERS[mockUserIndex].password = newPassword;
    
    toast.success("Password changed successfully");
    setLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        signup, 
        logout, 
        updateUserDosha, 
        resetPassword,
        updateUserProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
