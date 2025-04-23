import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '@/data/productData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isFavorite, toggleFavorite } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite: authIsFavorite } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [isCheckingFav, setIsCheckingFav] = useState(true);
  
  const product = id ? getProductById(id) : null;
  
  useEffect(() => {
    const checkFavorite = async () => {
      if (product) {
        setIsCheckingFav(true);
        const result = await authIsFavorite(product.id);
        setIsFav(result);
        setIsCheckingFav(false);
      }
    };
    
    checkFavorite();
  }, [product, authIsFavorite]);
  
  if (!product) {
    return (
      <div className="max-w-md mx-auto p-4 text-center py-20">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/shop')} className="ayur-button">
          Back to Shop
        </Button>
      </div>
    );
  }
  
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleFavoriteToggle = async () => {
    if (isFav) {
      await removeFromFavorites(product.id);
      setIsFav(false);
    } else {
      await addToFavorites(product.id);
      setIsFav(true);
    }
  };
  
  const relatedProducts = getRelatedProducts(product);
  
  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="relative h-72 w-full bg-white">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => navigate('/shop')}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={handleFavoriteToggle}
          disabled={isCheckingFav}
        >
          <Heart 
            size={20} 
            className={isFav ? "fill-red-500 text-red-500" : ""}
          />
        </Button>
      </div>
      
      <div className="p-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-ayur-light text-ayur-primary px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">4.7 (48 reviews)</span>
                </div>
              </div>
            </div>
            <span className="text-xl font-bold text-ayur-primary">${product.price.toFixed(2)}</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 rounded-xl bg-ayur-light border-none">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <Check size={20} className="text-ayur-primary" />
              </div>
              <div>
                <h3 className="font-medium">100% Authentic</h3>
                <p className="text-sm text-gray-600">Pure Ayurvedic ingredients</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex space-x-3">
            <Button 
              className="flex-1 ayur-button"
              onClick={() => {
                addItem(product);
                toast({
                  title: "Added to cart",
                  description: `${product.name} has been added to your cart`,
                });
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`border-gray-200 ${isFavorite(product.id) ? 'bg-red-50' : ''}`}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart 
                size={20} 
                className={isFavorite(product.id) ? "fill-red-500 text-red-500" : ""} 
              />
            </Button>
          </div>
        </motion.div>
        
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-medium mb-3 mt-8">You might also like</h2>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/shop/${relatedProduct.id}`)}
                >
                  <div className="relative pt-[100%]">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{relatedProduct.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium">${relatedProduct.price.toFixed(2)}</span>
                      <Button size="sm" variant="ghost" className="p-0 h-auto">
                        <ShoppingBag size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
