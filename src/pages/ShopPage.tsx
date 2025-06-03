
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '@/data/productData';
import { Search, ShoppingBag, Filter, X, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const { totalItems, addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a search query in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);
  
  const filteredProducts = getProductsByCategory(selectedCategory).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesPrice;
  });
  
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); // Prevent navigating to product detail
    
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image
    });
    
    toast.success(`${product.name} added to cart! 🛒✨`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast("Search results", {
        description: `Showing results for "${searchTerm}"`
      });
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Ayurvedic Products</h1>
            <p className="text-gray-600">Quality herbs and wellness items</p>
          </div>
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
        <form className="relative flex-1" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white rounded-full border-gray-200"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
        <button 
          className={`p-2 rounded-full shadow-sm ${showFilters ? 'bg-ayur-primary text-white' : 'bg-white'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
        </button>
      </motion.div>
      
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg shadow-sm p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setPriceRange([0, 50]);
                setShowFilters(false);
              }}
            >
              <X size={16} className="mr-1" /> Clear
            </Button>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Price Range</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={priceRange[0] === 0 && priceRange[1] === 20 ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => handlePriceRangeChange(0, 20)}
              >
                Under ₹20
              </Button>
              <Button 
                variant={priceRange[0] === 20 && priceRange[1] === 35 ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => handlePriceRangeChange(20, 35)}
              >
                ₹20 - ₹35
              </Button>
              <Button 
                variant={priceRange[0] === 35 && priceRange[1] === 50 ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => handlePriceRangeChange(35, 50)}
              >
                Over ₹35
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </Button>
        </motion.div>
      )}
      
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
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onClick={() => navigate(`/shop/${product.id}`)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=AyurNest";
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-ayur-primary">₹{product.price.toFixed(2)}</Badge>
                  <button 
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-white/90 text-ayur-primary hover:bg-white transition-colors"
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
                <div className="p-3" onClick={() => navigate(`/shop/${product.id}`)}>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <h3 className="text-gray-500">No products found</h3>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search term or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
