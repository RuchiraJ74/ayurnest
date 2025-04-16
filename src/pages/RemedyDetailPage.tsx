
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRemedyById } from '@/data/remediesData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, AlertCircle, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const RemedyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const remedy = id ? getRemedyById(id) : null;
  
  if (!remedy) {
    return (
      <div className="max-w-md mx-auto p-4 text-center py-20">
        <h2 className="text-xl font-bold mb-2">Remedy Not Found</h2>
        <p className="mb-6">The remedy you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/remedies')} className="ayur-button">
          Back to Remedies
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="relative h-64 w-full">
        <img 
          src={remedy.image} 
          alt={remedy.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/30 backdrop-blur-sm text-white hover:bg-white/40 self-start"
            onClick={() => navigate('/remedies')}
          >
            <ArrowLeft size={20} />
          </Button>
          
          <div className="text-white">
            <h1 className="text-2xl font-bold">{remedy.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-ayur-primary/90 text-white px-2 py-1 rounded-full">
                {remedy.category}
              </span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">{remedy.description}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 rounded-xl">
            <h2 className="text-lg font-medium mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {remedy.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-ayur-primary mt-2"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-ayur-primary" />
              <h2 className="text-lg font-medium">Preparation</h2>
            </div>
            <ol className="space-y-3">
              {remedy.preparation.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <div className="bg-ayur-light rounded-full h-6 w-6 flex items-center justify-center text-ayur-primary flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 rounded-xl">
            <h2 className="text-lg font-medium mb-3">Usage</h2>
            <p className="text-gray-700">{remedy.usage}</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Check size={18} className="text-green-600" />
              <h2 className="text-lg font-medium">Benefits</h2>
            </div>
            <ul className="space-y-2">
              {remedy.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-600 mt-2"></div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 rounded-xl bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-amber-600" />
              <h2 className="text-lg font-medium">Cautions</h2>
            </div>
            <p className="text-gray-700">{remedy.cautions}</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-medium mb-2">Suitable For</h2>
          <div className="flex flex-wrap gap-2">
            {remedy.suitableFor.map((dosha, index) => (
              <span 
                key={index} 
                className="text-sm bg-ayur-light text-ayur-primary px-3 py-1 rounded-full"
              >
                {dosha}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RemedyDetailPage;
