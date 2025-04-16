
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doshaProfiles } from '@/data/doshaData';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const DoshaResult: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const dosha = user?.dosha || 'tridosha';
  const doshaProfile = doshaProfiles[dosha as keyof typeof doshaProfiles];
  
  return (
    <div className="min-h-screen bg-ayur-light p-4">
      <div className="max-w-md mx-auto pt-6 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold font-playfair text-ayur-secondary mb-2">
              Your Dosha: {doshaProfile.dosha.replace('-', '-').toUpperCase()}
            </h1>
            <div className="h-1 w-20 bg-ayur-primary mx-auto"></div>
          </div>
          
          <p className="text-gray-700 mb-6">{doshaProfile.description}</p>
          
          <h2 className="text-xl font-semibold text-ayur-secondary mb-3">Your Characteristics</h2>
          <ul className="list-disc list-inside mb-6 space-y-1">
            {doshaProfile.characteristics.map((characteristic, index) => (
              <li key={index} className="text-gray-700">{characteristic}</li>
            ))}
          </ul>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-md font-semibold text-ayur-secondary mb-2">Recommended Foods</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {doshaProfile.recommendedFoods.slice(0, 4).map((food, index) => (
                  <li key={index} className="text-gray-700">{food}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-md font-semibold text-ayur-secondary mb-2">Foods to Limit</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {doshaProfile.foodsToAvoid.slice(0, 4).map((food, index) => (
                  <li key={index} className="text-gray-700">{food}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <Button 
            onClick={() => navigate('/home')} 
            className="ayur-button w-full py-5"
          >
            Explore Your Personal Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate('/daily-routine')} 
            variant="outline" 
            className="w-full border-ayur-primary text-ayur-primary hover:bg-ayur-light py-5"
          >
            View Your Recommended Daily Routine
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DoshaResult;
