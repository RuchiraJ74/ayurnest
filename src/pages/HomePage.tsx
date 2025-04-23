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

  const exploreCards = [
    {
      title: "Daily Routines",
      description: "Harmonize your day with Ayurvedic practices",
      path: "/daily-routine",
      bgClass: "from-amber-50 to-amber-100",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Ayurvedic Diet",
      description: "Nourish your body with the right foods",
      path: "/diet",
      bgClass: "from-green-50 to-green-100",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Natural Remedies",
      description: "Traditional solutions for common ailments",
      path: "/remedies",
      bgClass: "from-purple-50 to-purple-100",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Herbal Shop",
      description: "Quality Ayurvedic products and herbs",
      path: "/shop",
      bgClass: "from-blue-50 to-blue-100",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

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
          {exploreCards.map((card) => (
            <Card 
              key={card.title}
              className={`p-0 overflow-hidden border-none hover:shadow-md transition-shadow cursor-pointer h-48 relative`}
              onClick={() => navigate(card.path)}
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent`} />
              </div>
              
              <div className="absolute bottom-0 left-0 p-4 w-full z-10">
                <h3 className="font-medium mb-1 text-white">{card.title}</h3>
                <p className="text-xs text-white/80">{card.description}</p>
              </div>
            </Card>
          ))}
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
