
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, Heart, Activity, Search, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doshaProfiles } from '@/data/doshaData';
import { getRoutineByDosha } from '@/data/routineData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const dosha = user?.dosha || 'tridosha';
  const doshaProfile = doshaProfiles[dosha as keyof typeof doshaProfiles];
  const routine = getRoutineByDosha(dosha);
  
  // Get current time to show relevant routine activities
  const now = new Date();
  const currentHour = now.getHours();
  let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning';
  
  if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = 'afternoon';
  } else if (currentHour >= 17) {
    timeOfDay = 'evening';
  }
  
  const currentRoutine = routine[timeOfDay];
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium">AyurNest</h1>
          <p className="text-sm text-gray-500">Personalized wellness</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <Card className="bg-gradient-to-r from-ayur-primary to-ayur-secondary p-5 text-white rounded-xl">
          <h2 className="text-lg font-medium">Welcome back, {user?.username || 'Guest'}!</h2>
          <p className="text-white/90 text-sm mb-3">
            Your dosha type is: <span className="font-semibold">{dosha.toUpperCase()}</span>
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/20 text-white border-white/40 hover:bg-white/30 transition-colors"
            onClick={() => navigate('/dosha-result')}
          >
            View Dosha Profile
          </Button>
        </Card>
      </motion.div>
      
      {/* Current Routine */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Your {timeOfDay} routine</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/daily-routine')}
            className="text-ayur-primary text-sm"
          >
            See all
          </Button>
        </div>
        <Card className="rounded-xl overflow-hidden">
          <div className="space-y-3 p-4">
            {currentRoutine.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-ayur-light rounded-full p-2 mt-1">
                  <Calendar size={18} className="text-ayur-primary" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{item.time}</span>
                    <span className="text-sm text-gray-500">{item.activity}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
      
      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4"
      >
        <h2 className="text-lg font-medium mb-4">Explore Ayurvedic Wellness</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/remedies')}
          >
            <div className="ayur-category-icon">
              <Heart size={24} />
            </div>
            <h3 className="font-medium">Remedies</h3>
            <p className="text-xs text-gray-500 mt-1">Natural healing solutions</p>
          </Card>
          
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/shop')}
          >
            <div className="ayur-category-icon">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-medium">Products</h3>
            <p className="text-xs text-gray-500 mt-1">Ayurvedic essentials</p>
          </Card>
          
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/daily-routine')}
          >
            <div className="ayur-category-icon">
              <Calendar size={24} />
            </div>
            <h3 className="font-medium">Daily Routine</h3>
            <p className="text-xs text-gray-500 mt-1">Customize your schedule</p>
          </Card>
          
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/diet')}
          >
            <div className="ayur-category-icon">
              <Activity size={24} />
            </div>
            <h3 className="font-medium">Diet Plan</h3>
            <p className="text-xs text-gray-500 mt-1">Dosha-specific nutrition</p>
          </Card>
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4"
      >
        <h2 className="text-lg font-medium mb-3">Personalized for You</h2>
        <Card className="rounded-xl p-4">
          <h3 className="font-medium mb-2">Foods to favor for {dosha} balance:</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {doshaProfile.recommendedFoods.slice(0, 4).map((food, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ayur-primary"></div>
                <span className="text-sm">{food}</span>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-ayur-primary text-ayur-primary hover:bg-ayur-light w-full"
            onClick={() => navigate('/diet')}
          >
            View Complete Diet Plan
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomePage;
