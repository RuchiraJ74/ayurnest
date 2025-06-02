
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doshaProfiles } from '@/data/doshaData';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const DoshaResult: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dosha, setDosha] = useState<string>('tridosha');
  
  useEffect(() => {
    // Try to get dosha from user object first
    if (user?.dosha) {
      setDosha(user.dosha);
      return;
    }
    
    // If not available in user object, try to get from supabase or local storage
    const fetchUserDosha = async () => {
      // First try to get from Supabase if user is logged in
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('preferences')
            .eq('id', user.id)
            .single();
            
          if (data?.preferences && typeof data.preferences === 'object' && data.preferences !== null) {
            const preferences = data.preferences as any;
            if (preferences.dosha) {
              setDosha(preferences.dosha);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching dosha from profile:", error);
        }
      }
      
      // Fall back to local storage if not found in Supabase
      const savedDosha = localStorage.getItem('ayurnest_dosha');
      if (savedDosha) {
        setDosha(savedDosha);
      }
    };
    
    fetchUserDosha();
  }, [user]);
  
  // Save dosha to local storage and Supabase profile if user is logged in
  useEffect(() => {
    if (dosha && dosha !== 'tridosha') {
      // Save to local storage
      localStorage.setItem('ayurnest_dosha', dosha);
      
      // Save to Supabase if user is logged in
      if (user?.id) {
        const updateUserProfile = async () => {
          try {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('preferences')
              .eq('id', user.id)
              .single();
            
            let existingPreferences = {};
            if (existingProfile?.preferences && typeof existingProfile.preferences === 'object' && existingProfile.preferences !== null) {
              existingPreferences = existingProfile.preferences as any;
            }
            
            const updatedPreferences = {
              ...existingPreferences,
              dosha: dosha
            };
            
            await supabase
              .from('profiles')
              .update({ preferences: updatedPreferences })
              .eq('id', user.id);
          } catch (error) {
            console.error("Error saving dosha to profile:", error);
          }
        };
        
        updateUserProfile();
      }
    }
  }, [dosha, user]);
  
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
