
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Bell, Heart, Clock, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-ayur-light rounded-full flex items-center justify-center">
              <User size={30} className="text-ayur-primary" />
            </div>
            <div>
              <h2 className="text-xl font-medium">{user?.username || 'Guest'}</h2>
              <p className="text-gray-500">{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-500">Dosha Type</h3>
                <p className="font-medium">{user?.dosha ? user.dosha.toUpperCase() : 'Unknown'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Member Since</h3>
                <p className="font-medium">April 2023</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="divide-y">
              <ProfileMenuItem 
                icon={Bell} 
                title="Notifications" 
                description="Manage your alerts and notifications"
                onClick={() => navigate('/notifications')}
              />
              <ProfileMenuItem 
                icon={Heart} 
                title="My Favorites" 
                description="View your saved remedies and products"
                onClick={() => navigate('/favorites')}
              />
              <ProfileMenuItem 
                icon={Clock} 
                title="Order History" 
                description="Check your previous orders"
                onClick={() => navigate('/orders')}
              />
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="divide-y">
              <ProfileMenuItem 
                icon={Clock} 
                title="Dosha Assessment" 
                description="Retake your Dosha quiz"
                onClick={() => navigate('/dosha-test')}
              />
              <ProfileMenuItem 
                icon={Settings} 
                title="Account Settings" 
                description="Manage your account preferences"
                onClick={() => {}}
              />
              <ProfileMenuItem 
                icon={Bell} 
                title="About AyurNest" 
                description="Learn more about our mission"
                onClick={() => {}}
              />
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

interface ProfileMenuItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button 
      className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="bg-ayur-light rounded-full p-2">
          <Icon size={18} className="text-ayur-primary" />
        </div>
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );
};

export default ProfilePage;
