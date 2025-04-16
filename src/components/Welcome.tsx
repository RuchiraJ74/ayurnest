
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ayur-light p-4 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
          <img 
            src="https://t4.ftcdn.net/jpg/03/11/53/77/360_F_311537787_V5pD8sE52ZSTb5Kj3BOKevntFUaZv4AG.jpg" 
            alt="Ayurveda Wellness" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-playfair font-bold text-ayur-secondary mb-4`}>
          Welcome to AyurNest
        </h1>
        <p className="text-base text-gray-700 max-w-md mx-auto px-2">
          A home for Ayurvedic wellness. Discover personalized routines, remedies, and products for balanced living.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
      >
        <div className="space-y-5">
          <Button 
            onClick={handleGetStarted} 
            className="ayur-button w-full py-5 text-lg"
          >
            Get Started
          </Button>
          
          <div className="relative flex items-center justify-center">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-sm text-gray-400 bg-white px-4">or</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>
          
          <Button 
            onClick={handleLogin} 
            variant="outline" 
            className="w-full border-ayur-primary text-ayur-primary hover:bg-ayur-light py-5 text-lg"
          >
            Login
          </Button>
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6 text-sm text-gray-500"
      >
        Your journey to balanced wellness begins here
      </motion.p>
    </div>
  );
};

export default Welcome;
