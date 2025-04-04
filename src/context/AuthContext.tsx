
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

// Define the Dosha type to match the specific string union type expected
type DoshaType = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';

// User interface with properly typed dosha
export interface User {
  id: string;
  username: string;
  email: string;
  dosha: DoshaType;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
  updateUserDosha: (dosha: DoshaType) => void;
}

// Mock users data with proper typing
const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@ayurnest.com',
    password: 'password',
    dosha: 'vata-pitta' as DoshaType
  },
  {
    id: '2',
    username: 'test',
    email: 'test@ayurnest.com',
    password: 'password',
    dosha: 'kapha' as DoshaType
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast: useToastHook } = useToast();
  
  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('ayurnest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API request
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ayurnest_user', JSON.stringify(userWithoutPassword));
      toast("Login successful", {
        description: `Welcome back, ${foundUser.username}!`,
      });
      navigate('/home');
    } else {
      throw new Error('Invalid credentials');
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayurnest_user');
    navigate('/');
  };
  
  // Signup function
  const signup = async (username: string, email: string, password: string) => {
    // Simulate API request
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create a new user with default dosha type
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      username,
      email,
      password,
      dosha: 'tridosha' as DoshaType
    };
    
    // In a real app, we would send this to an API
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('ayurnest_user', JSON.stringify(userWithoutPassword));
    
    // Redirect to dosha test to complete profile
    navigate('/dosha-test');
  };
  
  // Update user dosha
  const updateUserDosha = (dosha: DoshaType) => {
    if (user) {
      const updatedUser = { ...user, dosha };
      setUser(updatedUser);
      localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout, 
        signup,
        updateUserDosha
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
