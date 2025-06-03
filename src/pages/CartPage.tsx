
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleCheckout = () => {
    navigate('/checkout');
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
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Shopping Cart</h1>
      </div>
      
      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10"
        >
          <div className="mx-auto bg-ayur-light rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-ayur-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some Ayurvedic products to your cart</p>
          <Button 
            onClick={() => navigate('/shop')} 
            className="ayur-button"
          >
            Browse Products
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-3 flex gap-3">
                  <div 
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/shop/${item.product.id}`)}
                  >
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div 
                      className="font-medium cursor-pointer"
                      onClick={() => navigate(`/shop/${item.product.id}`)}
                    >
                      {item.product.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{item.product.category}</div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-ayur-primary">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </Button>
                          
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-medium">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹50.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-ayur-primary">
                    ₹{(totalPrice + 50 + totalPrice * 0.05).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="ayur-button w-full py-6" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
