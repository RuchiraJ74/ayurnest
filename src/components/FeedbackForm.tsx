
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackFormProps = {
  onSubmit?: () => void;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addFeedback, user } = useAuth();
  const [submittedFeedback, setSubmittedFeedback] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit feedback");
      return;
    }
    
    if (rating === 0) {
      toast("Rating required", {
        description: "Please provide a rating before submitting"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const feedback = addFeedback({
        rating,
        message: message.trim() || "Great experience!"
      });
      
      if (feedback) {
        setSubmittedFeedback(prev => [...prev, feedback]);
        setRating(0);
        setMessage('');
        
        if (onSubmit) {
          onSubmit();
        }
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-ayur-secondary mb-4">Share Your Feedback</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Comments (Optional)
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your experience..."
            className="h-24"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-ayur-primary hover:bg-ayur-secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
      
      <AnimatePresence>
        {submittedFeedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="font-medium text-ayur-secondary mb-3">Your Recent Feedback</h3>
            {submittedFeedback.map((feedback, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{user?.username || "User"}</p>
                    <div className="flex mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{feedback.message}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;
