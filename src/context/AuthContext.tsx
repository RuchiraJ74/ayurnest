
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
type User = {
  id: string;
  username: string;
  email: string;
  dosha?: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';
};

// Define context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserDosha: (dosha: string) => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data (simulating backend)
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123',
    dosha: 'vata-pitta',
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
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        dosha: foundUser.dosha,
      };
      setUser(userData);
      localStorage.setItem('ayurnest_user', JSON.stringify(userData));
    } else {
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
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
    };
    
    // In a real app, this would be a server-side operation
    MOCK_USERS.push(newUser);
    
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    
    setUser(userData);
    localStorage.setItem('ayurnest_user', JSON.stringify(userData));
    setLoading(false);
  };

  // Logout functionality
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayurnest_user');
  };

  // Update user's dosha
  const updateUserDosha = (dosha: string) => {
    if (user) {
      const updatedUser = { ...user, dosha };
      setUser(updatedUser);
      localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserDosha }}>
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
