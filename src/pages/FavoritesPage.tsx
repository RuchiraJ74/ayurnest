
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart, Product } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addItem } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);
  
  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch products from Supabase that match the IDs in favorites array
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .in('id', favorites);
      
      if (error) {
        console.error('Error fetching favorite products:', error);
        toast({
          title: "Error",
          description: "Failed to load favorite products",
          variant: "destructive"
        });
        setFavoriteProducts([]);
      } else if (productsData) {
        setFavoriteProducts(productsData as Product[]);
      }
    } catch (error) {
      console.error('Error in favorite products fetch:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleRemoveFavorite = async (productId: string) => {
    await toggleFavorite(productId);
  };
  
  const filteredProducts = searchQuery 
    ? favoriteProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favoriteProducts;
    
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
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Your Favorites</h1>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search your favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 bg-gray-100 rounded-full p-4 inline-block">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">
            Products you favorite will appear here
          </p>
          <Button 
            onClick={() => navigate('/shop')}
            className="ayur-button"
          >
            Browse Shop
          </Button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card 
                className="overflow-hidden"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="h-36 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(product.id);
                }}
              >
                <Heart size={16} className="fill-red-500 text-red-500" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
