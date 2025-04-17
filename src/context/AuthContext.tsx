import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Define user type
type UserProfile = {
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
  fullName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
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

type TrackingInfo = {
  currentStatus: string;
  estimatedDelivery?: string;
  lastUpdated: string;
  location?: string;
};

type UserPreferences = {
  darkMode: boolean;
  notifications: boolean;
  emailUpdates: boolean;
};

// Define context type
type AuthContextType = {
  user: UserProfile | null;
  authUser: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserDosha: (dosha: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => Promise<boolean>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'userId' | 'username' | 'date'>) => Promise<Feedback | undefined>;
  getFeedback: () => Promise<Feedback[]>;
  submitSupportMessage: (issueType: string, message: string) => Promise<void>;
  getDarkMode: () => boolean;
  getFavorites: () => Promise<string[]>;
  refreshUserProfile: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  authUser: null,
  session: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUserDosha: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  changePassword: async () => {},
  toggleDarkMode: async () => {},
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: async () => false,
  addOrder: async () => {},
  addFeedback: async () => undefined,
  getFeedback: async () => [],
  submitSupportMessage: async () => {},
  getDarkMode: () => false,
  getFavorites: async () => [],
  refreshUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Get user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Get user data from auth
      const { data: userData } = await supabase.auth.getUser();

      // Get favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
      }

      const favoriteIds = favoritesData?.map(item => item.product_id) || [];
      setFavorites(favoriteIds);

      // Get orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          order_date, 
          status, 
          payment_method, 
          delivery_address, 
          total_amount,
          tracking_info,
          order_items(
            id, 
            product_id, 
            product_name, 
            quantity, 
            price
          )
        `)
        .eq('user_id', userId)
        .order('order_date', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      }

      // Transform orders data
      const orderHistory = ordersData?.map(order => {
        // Cast tracking_info to the correct type
        const trackingInfo = order.tracking_info as unknown as TrackingInfo;
        
        return {
          id: order.id,
          date: order.order_date,
          products: order.order_items.map((item: any) => ({
            id: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: order.total_amount,
          status: order.status as 'processing' | 'shipped' | 'delivered' | 'cancelled',
          paymentMethod: order.payment_method,
          deliveryAddress: order.delivery_address,
          phoneNumber: profileData?.phone_number || '',
          trackingDetails: trackingInfo ? {
            currentStatus: trackingInfo.currentStatus,
            estimatedDelivery: trackingInfo.estimatedDelivery,
            lastUpdated: trackingInfo.lastUpdated,
            location: trackingInfo.location,
          } : undefined,
        };
      }) || [];

      // Parse preferences
      const preferences = profileData?.preferences as unknown as UserPreferences || 
        { darkMode: false, notifications: true, emailUpdates: false };

      // Create user object
      const userProfile: UserProfile = {
        id: userId,
        username: userData.user?.user_metadata?.full_name || profileData?.full_name || 'User',
        email: userData.user?.email || '',
        dosha: userData.user?.user_metadata?.dosha,
        joinDate: profileData?.signup_date,
        favorites: favoriteIds,
        orderHistory,
        preferences: {
          darkMode: preferences.darkMode || false,
          notifications: preferences.notifications || true,
          emailUpdates: preferences.emailUpdates || false,
        },
        fullName: profileData?.full_name,
        phoneNumber: profileData?.phone_number,
        deliveryAddress: profileData?.delivery_address,
      };

      setUser(userProfile);

      // Apply dark mode if enabled
      if (userProfile.preferences?.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setAuthUser(newSession?.user || null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setAuthUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (authUser) {
      await fetchUserProfile(authUser.id);
    }
  };

  // Login functionality
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        throw error;
      }
      
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup functionality
  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username,
          },
        },
      });
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message,
        });
        throw error;
      }
      
      // The profile is created via the database trigger
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout functionality
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Logout failed", {
          description: error.message,
        });
        return;
      }
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user's dosha
  const updateUserDosha = async (dosha: string) => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to update your dosha",
      });
      return;
    }
    
    try {
      // Update user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { dosha },
      });
      
      if (error) {
        toast.error("Failed to update dosha", {
          description: error.message,
        });
        return;
      }
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          dosha: dosha as 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha',
        });
      }
      
      toast.success("Dosha updated successfully");
    } catch (error) {
      console.error('Update dosha error:', error);
    }
  };
  
  // Reset password functionality
  const resetPassword = async (email: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error("Password reset failed", {
          description: error.message,
        });
        throw error;
      }
      
      toast.success("Password reset link sent", {
        description: "Check your email for the reset link",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (userData: Partial<UserProfile>) => {
    if (!authUser || !user) {
      toast.error("Not logged in", {
        description: "You must be logged in to update your profile",
      });
      throw new Error('You must be logged in to update your profile');
    }
    
    setLoading(true);
    
    try {
      // Update profile data in Supabase
      const profileData: any = {};
      
      if (userData.fullName) {
        profileData.full_name = userData.fullName;
      }
      
      if (userData.phoneNumber) {
        profileData.phone_number = userData.phoneNumber;
      }
      
      if (userData.deliveryAddress) {
        profileData.delivery_address = userData.deliveryAddress;
      }
      
      if (userData.preferences) {
        profileData.preferences = {
          ...(user.preferences || {}),
          ...userData.preferences,
        };
      }
      
      if (Object.keys(profileData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', authUser.id);
        
        if (profileError) {
          toast.error("Profile update failed", {
            description: profileError.message,
          });
          throw profileError;
        }
      }
      
      // Update email or user metadata if needed
      if (userData.email || userData.username) {
        const userUpdateData: any = {
          data: {},
        };
        
        if (userData.email) {
          userUpdateData.email = userData.email;
        }
        
        if (userData.username) {
          userUpdateData.data.full_name = userData.username;
        }
        
        const { error: userError } = await supabase.auth.updateUser(userUpdateData);
        
        if (userError) {
          toast.error("User update failed", {
            description: userError.message,
          });
          throw userError;
        }
      }
      
      // Update local user state
      setUser({
        ...user,
        ...userData,
      });
      
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to change your password",
      });
      throw new Error('You must be logged in to change your password');
    }
    
    setLoading(true);
    
    try {
      // First sign in with the current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error("Current password is incorrect", {
          description: signInError.message,
        });
        throw signInError;
      }
      
      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        toast.error("Password change failed", {
          description: updateError.message,
        });
        throw updateError;
      }
      
      toast.success("Password changed", {
        description: "Your password has been changed successfully",
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = async () => {
    if (!authUser || !user || !user.preferences) {
      toast.error("Not logged in", {
        description: "You must be logged in to change appearance settings",
      });
      return;
    }
    
    const newDarkMode = !user.preferences.darkMode;
    
    try {
      // Update preferences in profile
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...user.preferences,
            darkMode: newDarkMode,
          },
        })
        .eq('id', authUser.id);
      
      if (error) {
        toast.error("Failed to update appearance settings", {
          description: error.message,
        });
        return;
      }
      
      // Update local state
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          darkMode: newDarkMode,
        },
      });
      
      // Update the document class
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
        toast.success("Dark mode enabled");
      } else {
        document.documentElement.classList.remove('dark');
        toast.success("Light mode enabled");
      }
    } catch (error) {
      console.error('Toggle dark mode error:', error);
    }
  };

  // Get dark mode status
  const getDarkMode = (): boolean => {
    return user?.preferences?.darkMode || false;
  };

  // Fetch favorites
  const getFavorites = async (): Promise<string[]> => {
    if (!authUser) {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', authUser.id);
      
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      const favoriteIds = data.map(item => item.product_id);
      setFavorites(favoriteIds);
      return favoriteIds;
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  };

  // Favorites handling
  const addToFavorites = async (productId: string) => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to add favorites",
      });
      return;
    }

    try {
      // Check if already in favorites
      const isFav = await isFavorite(productId);
      if (isFav) return;
      
      // Add to favorites in database
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: authUser.id,
          product_id: productId,
        });
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.info("Already in favorites");
          return;
        }
        
        toast.error("Failed to add to favorites", {
          description: error.message,
        });
        return;
      }
      
      // Update local state
      const updatedFavorites = [...favorites, productId];
      setFavorites(updatedFavorites);
      
      if (user) {
        setUser({
          ...user,
          favorites: updatedFavorites,
        });
      }
      
      toast.success("Added to favorites!");
    } catch (error) {
      console.error('Add to favorites error:', error);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to remove favorites",
      });
      return;
    }
    
    try {
      // Remove from favorites in database
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', authUser.id)
        .eq('product_id', productId);
      
      if (error) {
        toast.error("Failed to remove from favorites", {
          description: error.message,
        });
        return;
      }
      
      // Update local state
      const updatedFavorites = favorites.filter(id => id !== productId);
      setFavorites(updatedFavorites);
      
      if (user) {
        setUser({
          ...user,
          favorites: updatedFavorites,
        });
      }
      
      toast.success("Removed from favorites!");
    } catch (error) {
      console.error('Remove from favorites error:', error);
    }
  };

  const isFavorite = async (productId: string): Promise<boolean> => {
    if (!authUser) return false;
    
    // Check local state first
    if (favorites.includes(productId)) return true;
    
    try {
      const { data, error, count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact' })
        .eq('user_id', authUser.id)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Check favorite error:', error);
        return false;
      }
      
      return (count !== null && count > 0);
    } catch (error) {
      console.error('Is favorite error:', error);
      return false;
    }
  };

  // Add an order to user history
  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to place an order",
      });
      return;
    }

    try {
      // Insert order into the database
      const { data: orderInsert, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: authUser.id,
          status: orderData.status,
          delivery_address: orderData.deliveryAddress,
          payment_method: orderData.paymentMethod,
          total_amount: orderData.totalAmount,
          tracking_info: orderData.trackingDetails || {
            currentStatus: 'processing',
            lastUpdated: new Date().toISOString(),
          },
        })
        .select()
        .single();
      
      if (orderError) {
        toast.error("Failed to place order", {
          description: orderError.message,
        });
        throw orderError;
      }
      
      // Insert order items
      const orderItems = orderData.products.map(product => ({
        order_id: orderInsert.id,
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        price: product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        toast.error("Failed to save order items", {
          description: itemsError.message,
        });
        throw itemsError;
      }
      
      // Create a notification for the user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: authUser.id,
          message: `Your order has been placed successfully and is now ${orderData.status}`,
          type: 'success',
        });
      
      if (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }
      
      // Update local user state with the new order
      const newOrder = {
        id: orderInsert.id,
        date: orderInsert.created_at,
        ...orderData,
      };
      
      if (user) {
        setUser({
          ...user,
          orderHistory: [newOrder, ...(user.orderHistory || [])],
        });
      }
      
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error('Add order error:', error);
      throw error;
    }
  };

  // Add feedback
  const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'userId' | 'username' | 'date'>): Promise<Feedback | undefined> => {
    if (!authUser || !user) {
      toast.error("Not logged in", {
        description: "You must be logged in to submit feedback",
      });
      return undefined;
    }

    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: authUser.id,
          username: user.username,
          rating: feedbackData.rating,
          message: feedbackData.message,
        })
        .select()
        .single();
      
      if (error) {
        toast.error("Failed to submit feedback", {
          description: error.message,
        });
        throw error;
      }
      
      const newFeedback: Feedback = {
        id: data.id,
        userId: data.user_id,
        username: data.username,
        rating: data.rating,
        message: data.message,
        date: data.created_at,
      };
      
      toast.success("Feedback submitted successfully!");
      return newFeedback;
    } catch (error) {
      console.error('Add feedback error:', error);
      return undefined;
    }
  };

  // Get all feedback
  const getFeedback = async (): Promise<Feedback[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Get feedback error:', error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        username: item.username,
        rating: item.rating,
        message: item.message,
        date: item.created_at,
      }));
    } catch (error) {
      console.error('Get feedback error:', error);
      return [];
    }
  };

  // Submit support message
  const submitSupportMessage = async (issueType: string, message: string): Promise<void> => {
    if (!authUser) {
      toast.error("Not logged in", {
        description: "You must be logged in to contact support",
      });
      throw new Error('You must be logged in to contact support');
    }
    
    try {
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: authUser.id,
          issue_type: issueType,
          message: message,
        });
      
      if (error) {
        toast.error("Failed to send support message", {
          description: error.message,
        });
        throw error;
      }
      
      toast.success("Support message sent", {
        description: "Your message has been sent to our support team",
      });
    } catch (error) {
      console.error('Submit support message error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        authUser,
        session,
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
        getDarkMode,
        getFavorites,
        refreshUserProfile,
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
