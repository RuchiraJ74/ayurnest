
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Heart, Clock, LogOut, ChevronRight, Settings, Info, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Profile</h1>
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 mb-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-ayur-primary" />
                <h3 className="font-medium">Your dosha reading is ready</h3>
              </div>
              <p className="text-sm text-gray-500">Check your personalized wellness recommendations.</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="text-ayur-primary" />
                <h3 className="font-medium">Order delivered</h3>
              </div>
              <p className="text-sm text-gray-500">Your recent order has been delivered.</p>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-ayur-primary" />
                  <div>
                    <h3 className="font-medium">Ashwagandha Root Powder</h3>
                    <p className="text-sm text-gray-500">Saved to favorites</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
                  View
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Clock className="text-ayur-primary" />
                  <div>
                    <h3 className="font-medium">Order #AY123</h3>
                    <p className="text-sm text-gray-500">Delivered on April 15, 2024</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
              <div className="text-sm text-gray-600">
                2 items • $45.98
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 space-y-4"
      >
        <Card>
          <div className="divide-y">
            <div className="p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => {}}>
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-ayur-primary" />
                  <div>
                    <h3 className="font-medium">Account Settings</h3>
                    <p className="text-sm text-gray-500">Manage your preferences</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => {}}>
                <div className="flex items-center gap-3">
                  <Info size={20} className="text-ayur-primary" />
                  <div>
                    <h3 className="font-medium">About AyurNest</h3>
                    <p className="text-sm text-gray-500">Learn about our mission</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </Card>

        <Button 
          variant="outline" 
          className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
