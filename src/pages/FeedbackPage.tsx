
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import FeedbackForm from '@/components/FeedbackForm';

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ayur-light p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary flex items-center gap-2">
              <MessageCircle className="w-8 h-8" />
              Feedback
            </h1>
          </div>
          <p className="text-gray-600">
            Share your experience with us! Your feedback helps us improve our service and better serve you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <FeedbackForm />
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
