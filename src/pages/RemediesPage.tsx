
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { remedies, remedyCategories, getRemediesByCategory } from '@/data/remediesData';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const RemediesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Remedies');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredRemedies = getRemediesByCategory(selectedCategory).filter(remedy => 
    remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    remedy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary mb-1">Ayurvedic Remedies</h1>
        <p className="text-gray-600">Natural solutions for holistic health</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search remedies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white rounded-full border-gray-200"
        />
      </motion.div>
      
      <div className="mb-6 overflow-x-auto pb-2">
        <Tabs 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="flex space-x-2 bg-transparent h-auto p-0">
            {remedyCategories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-full text-sm flex-shrink-0 data-[state=active]:bg-ayur-primary data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {filteredRemedies.length > 0 ? (
          filteredRemedies.map((remedy, index) => (
            <motion.div
              key={remedy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/remedies/${remedy.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{remedy.name}</h3>
                  <span className="text-xs bg-ayur-light text-ayur-primary px-2 py-1 rounded-full">
                    {remedy.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{remedy.description}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {remedy.suitableFor.map((dosha, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                    >
                      {dosha}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <h3 className="text-gray-500">No remedies found</h3>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemediesPage;
