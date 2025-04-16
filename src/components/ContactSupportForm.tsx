
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Send, HelpCircle } from 'lucide-react';

const ContactSupportForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, submitSupportMessage } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to contact support");
      return;
    }
    
    if (!subject || !message) {
      toast("Missing information", {
        description: "Please provide both subject and message"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitSupportMessage(`${subject}: ${message}`);
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="text-ayur-primary mr-2" size={24} />
          <h3 className="text-lg font-medium text-ayur-secondary">Contact Support</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Our support team is here to help you with any questions or concerns about your Ayurvedic journey.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is your question about?"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="support-message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              className="h-32"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-ayur-primary hover:bg-ayur-secondary flex items-center justify-center"
            disabled={isSubmitting}
          >
            <Send size={16} className="mr-2" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Other Ways to Reach Us</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Email: support@ayurnest.com</li>
            <li>• Phone: +1 (800) 123-4567</li>
            <li>• Hours: Monday-Friday, 9 AM - 5 PM EST</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportForm;
