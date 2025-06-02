import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/productData';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating?: number;
}

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { addItem, toggleFavorite, favorites } = useCart();
  const navigate = useNavigate();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [user, favorites]);

  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get products from local data based on favorites from context
      const products: Product[] = [];
      favorites.forEach(favoriteId => {
        const localProduct = getProductById(favoriteId);
        if (localProduct) {
          products.push({
            id: localProduct.id,
            name: localProduct.name,
            price: localProduct.price,
            image: localProduct.image,
            description: localProduct.description,
            category: localProduct.category,
            rating: 4.5
          });
        }
      });

      setFavoriteProducts(products);
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      await toggleFavorite(productId);
      toast.success('Removed from favorites 💔');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleAddToCart = (product: Product) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-md mx-auto pt-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Sign in to view favorites</h2>
            <p className="text-gray-500 mb-6">Create an account to save your favorite products</p>
            <Button onClick={() => navigate('/login')} className="ayur-button">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-md mx-auto pt-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ayur-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ayur-light p-4 pb-20">
      <div className="max-w-4xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-600 ml-8">Products you've saved for later ({favoriteProducts.length} items)</p>
        </motion.div>

        {favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Start exploring and save products you love! 💖</p>
            <Button onClick={() => navigate('/shop')} className="ayur-button">
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => navigate(`/shop/${product.id}`)}
                    />
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-ayur-secondary mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-ayur-primary">
                        ₹{product.price}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        className="ayur-button flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
