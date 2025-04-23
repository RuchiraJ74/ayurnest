
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Leaf, Droplet, Wind, Fire, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">About AyurNest</h1>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden mb-8 h-48"
      >
        <img 
          src="https://images.unsplash.com/photo-1611071211395-e09cfbf53c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Ayurveda Herbs and Oils" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-white text-2xl font-playfair mb-1">Balancing Mind, Body & Spirit</h2>
          <p className="text-white/90 text-sm">Your personal guide to holistic wellness</p>
        </div>
      </motion.div>
      
      {/* Mission Statement */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <motion.div variants={item} className="mb-6">
          <h2 className="text-xl font-medium font-playfair text-ayur-secondary mb-3">Our Mission</h2>
          <Card className="p-4 bg-ayur-light/20">
            <p className="text-gray-700">
              AyurNest is dedicated to bringing the ancient wisdom of Ayurveda into modern daily life. 
              We believe in personalized wellness that treats each individual as unique, with 
              custom recommendations based on your dosha balance and life rhythms.
            </p>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Features */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <motion.h2 variants={item} className="text-xl font-medium font-playfair text-ayur-secondary mb-4">
          Key Features
        </motion.h2>
        
        <div className="space-y-3">
          <motion.div variants={item}>
            <Card className="p-4 flex items-start">
              <div className="mr-4 p-2 bg-amber-100 rounded-full">
                <Leaf className="h-5 w-5 text-ayur-secondary" />
              </div>
              <div>
                <h3 className="font-medium">Personalized Dosha Analysis</h3>
                <p className="text-sm text-gray-600">Discover your unique mind-body constitution</p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-4 flex items-start">
              <div className="mr-4 p-2 bg-green-100 rounded-full">
                <Sun className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Daily Routines</h3>
                <p className="text-sm text-gray-600">Align your activities with natural rhythms</p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-4 flex items-start">
              <div className="mr-4 p-2 bg-purple-100 rounded-full">
                <Droplet className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Natural Remedies</h3>
                <p className="text-sm text-gray-600">Traditional solutions for common health concerns</p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-4 flex items-start">
              <div className="mr-4 p-2 bg-blue-100 rounded-full">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Ayurvedic Products</h3>
                <p className="text-sm text-gray-600">Quality herbs and formulations with real-time order tracking</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Doshas Explanation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <motion.h2 variants={item} className="text-xl font-medium font-playfair text-ayur-secondary mb-4">
          Understanding Doshas
        </motion.h2>
        
        <div className="space-y-3">
          <motion.div variants={item}>
            <Card className="p-4 border-l-4 border-l-amber-400">
              <div className="flex items-center mb-2">
                <Wind className="h-5 w-5 mr-2 text-amber-600" />
                <h3 className="font-medium">Vata Dosha</h3>
              </div>
              <p className="text-sm text-gray-600">
                Composed of Air and Space elements, governing movement and change
              </p>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-4 border-l-4 border-l-red-400">
              <div className="flex items-center mb-2">
                <Fire className="h-5 w-5 mr-2 text-red-600" />
                <h3 className="font-medium">Pitta Dosha</h3>
              </div>
              <p className="text-sm text-gray-600">
                Composed of Fire and Water elements, governing metabolism and transformation
              </p>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-4 border-l-4 border-l-blue-400">
              <div className="flex items-center mb-2">
                <Moon className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="font-medium">Kapha Dosha</h3>
              </div>
              <p className="text-sm text-gray-600">
                Composed of Earth and Water elements, governing structure and stability
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Benefits */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <motion.h2 variants={item} className="text-xl font-medium font-playfair text-ayur-secondary mb-4">
          Benefits of AyurNest
        </motion.h2>
        
        <motion.div variants={item}>
          <Card className="p-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Improved digestion and metabolism</p>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Enhanced energy and vitality</p>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Better stress management and mental clarity</p>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Natural approach to health maintenance</p>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Personalized approach to wellness</p>
              </li>
            </ul>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Contact/Learn More Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={() => navigate('/contact-support')}
          className="w-full ayur-button"
        >
          Contact Us
        </Button>
      </motion.div>
    </div>
  );
};

export default AboutPage;
