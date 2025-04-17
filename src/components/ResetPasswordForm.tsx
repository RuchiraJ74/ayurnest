
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Lock, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an access token in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (!accessToken) {
      setIsError(true);
      toast.error("Invalid Link", {
        description: "This password reset link is invalid or has expired."
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast("Missing information", {
        description: "Please fill in all fields."
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast("Passwords don't match", {
        description: "Please make sure your passwords match."
      });
      return;
    }
    
    if (password.length < 6) {
      toast("Password too short", {
        description: "Password must be at least 6 characters."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the password using the hash token
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success("Password updated!", {
        description: "Your password has been reset successfully."
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setIsError(true);
      toast.error("Password reset failed", {
        description: error instanceof Error ? error.message : "Failed to reset password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-ayur-light p-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="mx-auto bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">
              Invalid Link
            </h1>
            <p className="text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
            <p className="text-gray-600">
              Please request a new password reset link to continue.
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/forgot-password')}
              >
                Request New Link
              </Button>
              <Button 
                variant="link" 
                className="w-full text-ayur-primary"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-ayur-light p-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="mx-auto bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Check size={32} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">
              Password Updated
            </h1>
            <p className="text-gray-600">
              Your password has been reset successfully.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
            <p className="text-gray-600">
              You can now log in with your new password.
            </p>
            <div className="pt-4">
              <Button 
                className="ayur-button w-full py-6"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ayur-light p-4">
      <button 
        onClick={() => navigate('/login')} 
        className="self-start flex items-center text-ayur-primary mb-6"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to Login</span>
      </button>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
            <Lock size={32} className="text-ayur-primary" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Create a new password for your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Create a new password"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Confirm your new password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="ayur-button w-full py-6" 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;
