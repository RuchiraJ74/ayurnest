
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { doshaProfiles } from '@/data/doshaData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DietPage: React.FC = () => {
  const { user } = useAuth();
  const dosha = user?.dosha || 'tridosha';
  const doshaProfile = doshaProfiles[dosha as keyof typeof doshaProfiles];
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary mb-1">Dietary Recommendations</h1>
        <p className="text-gray-600">Based on your {dosha.toUpperCase()} constitution</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="recommend">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="recommend">Recommended</TabsTrigger>
            <TabsTrigger value="avoid">Limit or Avoid</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommend">
            <Card className="p-4 rounded-xl shadow-md mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-medium">Foods to Favor</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">These foods help balance your {dosha} constitution and promote well-being:</p>
              
              <div className="space-y-4">
                <FoodCategoryList 
                  title="Fruits" 
                  items={getFoodsByCategory(doshaProfile.recommendedFoods, 'fruits')} 
                  color="green"
                />
                
                <FoodCategoryList 
                  title="Vegetables" 
                  items={getFoodsByCategory(doshaProfile.recommendedFoods, 'vegetables')} 
                  color="green"
                />
                
                <FoodCategoryList 
                  title="Grains & Proteins" 
                  items={getFoodsByCategory(doshaProfile.recommendedFoods, 'grains')} 
                  color="green"
                />
                
                <FoodCategoryList 
                  title="Dairy & Oils" 
                  items={getFoodsByCategory(doshaProfile.recommendedFoods, 'dairy')} 
                  color="green"
                />
                
                <FoodCategoryList 
                  title="Spices & Flavorings" 
                  items={getFoodsByCategory(doshaProfile.recommendedFoods, 'spices')} 
                  color="green"
                />
              </div>
            </Card>
            
            <Card className="p-4 rounded-xl">
              <h3 className="font-medium mb-2">Dietary Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-ayur-primary mt-0.5" />
                  <span className="text-sm">Focus on warm, freshly cooked meals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-ayur-primary mt-0.5" />
                  <span className="text-sm">Eat in a calm, relaxed environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-ayur-primary mt-0.5" />
                  <span className="text-sm">Make lunch your largest meal of the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-ayur-primary mt-0.5" />
                  <span className="text-sm">Include all six tastes in your meals when possible</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
          
          <TabsContent value="avoid">
            <Card className="p-4 rounded-xl shadow-md mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-medium">Foods to Limit</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">These foods may aggravate your {dosha} constitution and should be limited:</p>
              
              <div className="space-y-4">
                <FoodCategoryList 
                  title="Fruits" 
                  items={getFoodsByCategory(doshaProfile.foodsToAvoid, 'fruits')} 
                  color="red"
                />
                
                <FoodCategoryList 
                  title="Vegetables" 
                  items={getFoodsByCategory(doshaProfile.foodsToAvoid, 'vegetables')} 
                  color="red"
                />
                
                <FoodCategoryList 
                  title="Grains & Proteins" 
                  items={getFoodsByCategory(doshaProfile.foodsToAvoid, 'grains')} 
                  color="red"
                />
                
                <FoodCategoryList 
                  title="Dairy & Oils" 
                  items={getFoodsByCategory(doshaProfile.foodsToAvoid, 'dairy')} 
                  color="red"
                />
                
                <FoodCategoryList 
                  title="Spices & Flavorings" 
                  items={getFoodsByCategory(doshaProfile.foodsToAvoid, 'spices')} 
                  color="red"
                />
              </div>
            </Card>
            
            <Card className="p-4 rounded-xl">
              <h3 className="font-medium mb-2">General Guidelines</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <span className="text-sm">Avoid eating when stressed or upset</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <span className="text-sm">Minimize processed, frozen, and leftover foods</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <span className="text-sm">Reduce intake of caffeine and alcohol</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <span className="text-sm">Avoid eating until previous meal is digested</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

interface FoodCategoryListProps {
  title: string;
  items: string[];
  color: 'green' | 'red';
}

const FoodCategoryList: React.FC<FoodCategoryListProps> = ({ title, items, color }) => {
  if (items.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium text-sm mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-y-1 gap-x-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to categorize foods
const getFoodsByCategory = (foods: string[], category: string): string[] => {
  const categories: Record<string, string[]> = {
    fruits: ['apple', 'banana', 'berry', 'berries', 'mango', 'papaya', 'pear', 'fruit', 'sweet fruit', 'dried fruit', 'melon', 'citrus', 'orange', 'lemon', 'lime', 'grape', 'grapefruit', 'peach', 'plum', 'cherry', 'apricot', 'pineapple', 'pomegranate', 'date', 'fig', 'raisin'],
    vegetables: ['vegetable', 'leafy green', 'green', 'kale', 'spinach', 'lettuce', 'broccoli', 'cabbage', 'cauliflower', 'carrot', 'beet', 'cucumber', 'zucchini', 'squash', 'potato', 'tomato', 'eggplant', 'onion', 'garlic', 'pepper', 'root vegetable', 'asparagus', 'celery', 'corn', 'mushroom'],
    grains: ['grain', 'rice', 'wheat', 'oat', 'barley', 'millet', 'quinoa', 'pasta', 'bread', 'cereal', 'bean', 'lentil', 'chickpea', 'mung', 'meat', 'chicken', 'fish', 'protein', 'egg', 'nut', 'seed', 'almond', 'cashew', 'walnut', 'soy', 'tofu', 'legume'],
    dairy: ['milk', 'yogurt', 'cheese', 'curd', 'cream', 'butter', 'ghee', 'oil', 'dairy', 'coconut', 'almond milk', 'olive oil', 'sesame oil', 'sunflower oil'],
    spices: ['spice', 'herb', 'ginger', 'turmeric', 'cumin', 'coriander', 'fennel', 'cardamom', 'cinnamon', 'honey', 'sugar', 'salt', 'pepper', 'chili', 'cayenne', 'basil', 'mint', 'thyme', 'rosemary', 'oregano', 'clove', 'mustard', 'saffron', 'sweetener', 'tea', 'coffee']
  };
  
  return foods.filter(food => {
    const foodLower = food.toLowerCase();
    return categories[category].some(keyword => foodLower.includes(keyword));
  });
};

export default DietPage;
