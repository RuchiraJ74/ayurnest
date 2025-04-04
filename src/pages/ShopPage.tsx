
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '@/data/productData';
import { Search, ShoppingBag, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const filteredProducts = getProductsByCategory(selectedCategory).filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Ayurvedic Products</h1>
          <p className="text-gray-600">Quality herbs and wellness items</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <button 
            className="p-2 bg-white rounded-full shadow-sm relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-ayur-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200"
          />
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm">
          <Filter size={20} />
        </button>
      </motion.div>
      
      <div className="mb-6 overflow-x-auto pb-2">
        <Tabs 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="flex space-x-2 bg-transparent h-auto p-0">
            {categories.map(category => (
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
      
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/shop/${product.id}`)}
              >
                <div className="relative pt-[100%]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-ayur-primary">${product.price.toFixed(2)}</Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <h3 className="text-gray-500">No products found</h3>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
