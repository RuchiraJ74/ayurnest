
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
          } else if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const welcomeTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserName = () => {
    if (profile?.full_name) return profile.full_name.split(' ')[0];
    if (user?.username) return user.username;
    return "there";
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-gray-600">{welcomeTime()}</h2>
            <h1 className="text-2xl font-bold text-ayur-secondary">{getUserName()}</h1>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSearch} className="relative mb-8">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
          />
          <Input
            type="text"
            placeholder="Search remedies, herbs, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-medium mb-4 font-playfair">Your Wellness Journey</h2>
        <Card className="bg-gradient-to-br from-ayur-primary to-ayur-secondary text-white p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-5 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-x-3 translate-y-5" />
          
          <h3 className="text-lg font-medium mb-2">Discover Your Dosha</h3>
          <p className="text-sm text-white/80 mb-4">Take our Dosha quiz to get personalized Ayurvedic recommendations</p>
          
          <Button 
            variant="outline" 
            className="bg-white text-ayur-secondary border-none hover:bg-white/90"
            onClick={() => navigate('/dosha-test')}
          >
            Take Quiz <ArrowRight size={16} className="ml-2" />
          </Button>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-medium mb-4 font-playfair">Explore</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-none hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/daily-routine')}
          >
            <h3 className="font-medium mb-1">Daily Routines</h3>
            <p className="text-xs text-gray-600">Harmonize your day with Ayurvedic practices</p>
          </Card>
          
          <Card 
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-none hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/diet')}
          >
            <h3 className="font-medium mb-1">Ayurvedic Diet</h3>
            <p className="text-xs text-gray-600">Nourish your body with the right foods</p>
          </Card>
          
          <Card 
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-none hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/remedies')}
          >
            <h3 className="font-medium mb-1">Natural Remedies</h3>
            <p className="text-xs text-gray-600">Traditional solutions for common ailments</p>
          </Card>
          
          <Card 
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-none hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            <h3 className="font-medium mb-1">Herbal Shop</h3>
            <p className="text-xs text-gray-600">Quality Ayurvedic products and herbs</p>
          </Card>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/profile')}
        >
          View Profile
        </Button>
      </motion.div>
    </div>
  );
};

export default HomePage;
