
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProductById } from '@/data/productData';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  benefits?: string[];
  ingredients?: string[];
  usage?: string;
  rating?: number;
  reviews?: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      // First try to get from local data
      const localProduct = getProductById(id!);
      
      if (localProduct) {
        setProduct({
          id: localProduct.id,
          name: localProduct.name,
          price: localProduct.price,
          image: localProduct.image,
          description: localProduct.description,
          category: localProduct.category,
          benefits: ['Improves digestion', 'Boosts immunity', 'Natural ingredients'],
          ingredients: ['Organic herbs', 'Natural extracts', 'Pure ingredients'],
          usage: 'Take as directed by your healthcare provider',
          rating: 4.5,
          reviews: 127
        });
        setLoading(false);
        return;
      }

      // Fallback to database if local product not found
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/shop');
        return;
      }

      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.image_url,
          description: data.description,
          category: data.category,
          benefits: ['Improves digestion', 'Boosts immunity', 'Natural ingredients'],
          ingredients: ['Organic herbs', 'Natural extracts', 'Pure ingredients'],
          usage: 'Take as directed by your healthcare provider',
          rating: 4.5,
          reviews: 127
        });
      }
    } catch (error) {
      console.error('Error in fetchProduct:', error);
      toast.error('Failed to load product');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Create multiple items by calling addItem multiple times for the quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image
      });
    }
    
    toast.success(`${product.name} added to cart! 🛒✨`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-4xl mx-auto pt-6">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </button>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ayur-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-4xl mx-auto pt-6">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Product not found</h2>
            <Button onClick={() => navigate('/shop')} className="ayur-button">
              Back to Shop
            </Button>
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
        >
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-96 md:h-full object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-playfair font-bold text-ayur-secondary mb-2">
                    {product?.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product?.reviews} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-3xl font-bold text-ayur-primary mb-4">
                  ₹{product?.price}
                </p>

                <p className="text-gray-700 mb-6">{product?.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold text-ayur-secondary mb-2">Benefits:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product?.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-ayur-secondary mb-2">Ingredients:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product?.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-ayur-secondary mb-2">Usage:</h3>
                  <p className="text-sm text-gray-600">{product?.usage}</p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="ayur-button w-full mb-4 text-lg py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ₹{product ? product.price * quantity : 0}
                </Button>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-ayur-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Free Delivery</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-ayur-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-ayur-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
