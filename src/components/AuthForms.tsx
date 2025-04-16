
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Leaf, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(username, email, password);
      toast({
        title: "Account created!",
        description: "Welcome to AyurNest."
      });
      navigate('/dosha-test');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ayur-light p-4">
      <Link to="/" className="self-start flex items-center text-ayur-primary mb-6">
        <ArrowLeft size={20} className="mr-1" />
        <span>Back</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Leaf size={32} className="text-ayur-primary" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">Create Account</h1>
          <p className="text-gray-600">Begin your Ayurvedic wellness journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-ayur-primary" />
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Your username"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail size={16} className="mr-2 text-ayur-primary" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Your email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
              <Lock size={16} className="mr-2 text-ayur-primary" />
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Create a password"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
              <Lock size={16} className="mr-2 text-ayur-primary" />
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Confirm your password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="ayur-button w-full py-6" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Get Started"}
          </Button>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-ayur-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in."
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helper
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('demo@example.com', 'password123');
      toast({
        title: "Demo account",
        description: "You've logged in with the demo account."
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Demo login failed",
        description: "Something went wrong with the demo login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ayur-light p-4">
      <Link to="/" className="self-start flex items-center text-ayur-primary mb-6">
        <ArrowLeft size={20} className="mr-1" />
        <span>Back</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=400"
              alt="Relaxing ayurvedic items"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-1">Welcome Back</h1>
          <p className="text-gray-600">Continue your wellness journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail size={16} className="mr-2 text-ayur-primary" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Your email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                <Lock size={16} className="mr-2 text-ayur-primary" />
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-ayur-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-gray-300 focus:border-ayur-primary focus:ring-ayur-primary"
              placeholder="Your password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="ayur-button w-full py-6" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="relative flex items-center justify-center mt-6">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-sm text-gray-400 bg-white px-4">or</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-ayur-primary text-ayur-primary hover:bg-ayur-light" 
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Try Demo Account
          </Button>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ayur-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
