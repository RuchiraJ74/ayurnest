
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";

// Get the app URL for redirects (fallback to localhost only in development)
const APP_URL = window.location.origin;

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for error parameters in URL (for expired or invalid links)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');
    
    if (error) {
      setIsLinkExpired(true);
      toast.error("Link Error", {
        description: errorDescription || "Your password reset link is invalid or has expired."
      });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast("Email required", {
        description: "Please enter your email address."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Provide the correct redirect URL for password reset
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_URL}/reset-password`,
      });
      setIsSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to send reset link"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ayur-light p-4">
      <Link to="/login" className="self-start flex items-center text-ayur-primary mb-6">
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to Login</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
            {isLinkExpired ? 
              <AlertTriangle size={32} className="text-amber-500" /> : 
              <Mail size={32} className="text-ayur-primary" />
            }
          </div>
          <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">
            {isLinkExpired ? "Link Expired" : (isSubmitted ? "Check Your Email" : "Forgot Password")}
          </h1>
          <p className="text-gray-600">
            {isLinkExpired 
              ? "Your password reset link is invalid or has expired" 
              : (isSubmitted 
                ? "We've sent you instructions to reset your password" 
                : "Enter your email and we'll send you a reset link")}
          </p>
        </div>
        
        {isLinkExpired ? (
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
            <p className="text-gray-600">
              Please request a new password reset link to continue.
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsLinkExpired(false);
                  navigate('/forgot-password');
                }}
              >
                <RefreshCw size={16} className="mr-2" /> Request New Link
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
        ) : isSubmitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
            <p className="text-gray-600">
              A password reset link has been sent to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                <RefreshCw size={16} className="mr-2" /> Try Again
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
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
                placeholder="Your email address"
              />
            </div>
            
            <Button 
              type="submit" 
              className="ayur-button w-full py-6" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            
            <p className="text-center text-gray-600 text-sm mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-ayur-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
