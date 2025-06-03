
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; error: any }>;
  logout: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  submitSupportMessage: (subject: string, message: string) => Promise<void>;
  updateUserDosha: (dosha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error };
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined
        }
      });
      
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const submitSupportMessage = async (subject: string, message: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user.id,
          issue_type: subject,
          message: message,
          status: 'open'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Support message error:', error);
      throw error;
    }
  };

  const updateUserDosha = async (dosha: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          preferences: { dosha: dosha }
        });
      
      if (error) throw error;
      
      // Also save to localStorage
      localStorage.setItem('ayurnest_dosha', dosha);
    } catch (error) {
      console.error('Update dosha error:', error);
      // Still save to localStorage as fallback
      localStorage.setItem('ayurnest_dosha', dosha);
    }
  };

  const loginAsDemo = async () => {
    // Create a demo user object
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@ayurnest.com',
      user_metadata: {
        full_name: 'Demo User'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated'
    } as User;

    // Create a demo session
    const demoSession = {
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: demoUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    } as Session;

    // Set demo user and session
    setUser(demoUser);
    setSession(demoSession);
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    loginAsDemo,
    resetPassword,
    submitSupportMessage,
    updateUserDosha
  };

  return (
    <AuthContext.Provider value={value}>
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
