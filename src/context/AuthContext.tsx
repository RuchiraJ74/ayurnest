
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user type
type User = {
  id: string;
  username: string;
  email: string;
  dosha?: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha' | undefined;
  joinDate?: string;
  favorites?: string[];
  orderHistory?: Order[];
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
    emailUpdates: boolean;
  };
};

type Order = {
  id: string;
  date: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: string;
  phoneNumber: string;
  trackingDetails?: {
    currentStatus: string;
    estimatedDelivery?: string;
    lastUpdated: string;
    location?: string;
  };
};

type Feedback = {
  id: string;
  userId: string;
  username: string;
  rating: number;
  message: string;
  date: string;
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
  toggleDarkMode: () => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'userId' | 'username' | 'date'>) => Feedback | undefined;
  getFeedback: () => Feedback[];
  submitSupportMessage: (message: string) => Promise<void>;
  getDarkMode: () => boolean;
};

// Mock user type
type MockUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  dosha?: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';
  joinDate?: string;
  favorites?: string[];
  orderHistory?: Order[];
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
    emailUpdates: boolean;
  };
};

// Storage for feedback
let GLOBAL_FEEDBACK: Feedback[] = [];

// Mock users data (simulating backend)
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123',
    dosha: 'vata-pitta',
    joinDate: '2023-04-15',
    favorites: ['1', '5', '7'],
    orderHistory: [],
    preferences: {
      darkMode: false,
      notifications: true,
      emailUpdates: false,
    },
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
        favorites: foundUser.favorites || [],
        orderHistory: foundUser.orderHistory || [],
        preferences: foundUser.preferences || {
          darkMode: false,
          notifications: true,
          emailUpdates: false,
        },
      };
      setUser(userData);
      localStorage.setItem('ayurnest_user', JSON.stringify(userData));
      toast("Logged in successfully!");
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
      favorites: [],
      orderHistory: [],
      preferences: {
        darkMode: false,
        notifications: true,
        emailUpdates: false,
      },
    };
    
    // In a real app, this would be a server-side operation
    MOCK_USERS.push(newUser);
    
    const userData: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      joinDate: newUser.joinDate,
      favorites: [],
      orderHistory: [],
      preferences: {
        darkMode: false,
        notifications: true,
        emailUpdates: false,
      },
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
    toast.success("Changes saved!");
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (user && user.preferences) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          darkMode: !user.preferences.darkMode,
        }
      };
      setUser(updatedUser);
      localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
      toast.success("Appearance settings updated!");
      
      // Update the document with the appropriate class for dark mode
      if (updatedUser.preferences.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Get dark mode status
  const getDarkMode = (): boolean => {
    return user?.preferences?.darkMode || false;
  };

  // Favorites handling
  const addToFavorites = (productId: string) => {
    if (!user) {
      toast.error("You must be logged in to add favorites");
      return;
    }

    const favorites = user.favorites || [];
    if (!favorites.includes(productId)) {
      const updatedFavorites = [...favorites, productId];
      const updatedUser = { ...user, favorites: updatedFavorites };
      
      // Update mock user
      const mockUserIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (mockUserIndex !== -1) {
        MOCK_USERS[mockUserIndex].favorites = updatedFavorites;
      }
      
      setUser(updatedUser);
      localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
      toast.success("Added to favorites!");
    }
  };

  const removeFromFavorites = (productId: string) => {
    if (!user || !user.favorites) return;
    
    const updatedFavorites = user.favorites.filter(id => id !== productId);
    const updatedUser = { ...user, favorites: updatedFavorites };
    
    // Update mock user
    const mockUserIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (mockUserIndex !== -1) {
      MOCK_USERS[mockUserIndex].favorites = updatedFavorites;
    }
    
    setUser(updatedUser);
    localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
    toast.success("Removed from favorites!");
  };

  const isFavorite = (productId: string): boolean => {
    return user?.favorites?.includes(productId) || false;
  };

  // Add an order to user history
  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      ...orderData
    };

    const updatedOrderHistory = [...(user.orderHistory || []), newOrder];
    const updatedUser = { ...user, orderHistory: updatedOrderHistory };

    // Update mock user
    const mockUserIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (mockUserIndex !== -1) {
      MOCK_USERS[mockUserIndex].orderHistory = updatedOrderHistory;
    }

    setUser(updatedUser);
    localStorage.setItem('ayurnest_user', JSON.stringify(updatedUser));
    toast.success("Order placed successfully!");
  };

  // Add feedback
  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'userId' | 'username' | 'date'>): Feedback | undefined => {
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return undefined;
    }

    const newFeedback: Feedback = {
      id: Math.random().toString(36).substring(2, 11),
      userId: user.id,
      username: user.username,
      date: new Date().toISOString(),
      ...feedbackData
    };

    GLOBAL_FEEDBACK.push(newFeedback);
    toast.success("Feedback submitted!");
    return newFeedback;
  };

  // Get all feedback
  const getFeedback = (): Feedback[] => {
    return GLOBAL_FEEDBACK;
  };

  // Submit support message
  const submitSupportMessage = async (message: string): Promise<void> => {
    if (!user) {
      toast.error("You must be logged in to contact support");
      throw new Error('You must be logged in to contact support');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send the message to a support system
    toast.success("Support message sent!");
  };

  // Check if dark mode should be enabled on initial load
  useEffect(() => {
    if (user?.preferences?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

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
        changePassword,
        toggleDarkMode,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addOrder,
        addFeedback,
        getFeedback,
        submitSupportMessage,
        getDarkMode
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
