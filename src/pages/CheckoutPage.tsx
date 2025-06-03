import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, User, Mail, Phone, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentIcon } from '@/components/PaymentIcons';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod'
  });

  React.useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [items, navigate, orderPlaced]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/login');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const totalWithExtras = totalPrice + 50 + (totalPrice * 0.05);

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalWithExtras,
          delivery_address: formData.address,
          payment_method: formData.paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Failed to create order: ' + orderError.message);
        return;
      }

      // Create order items - store as individual items without product_id reference
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product_id: null // Don't reference non-existent products table
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        toast.error('Failed to save order items: ' + itemsError.message);
        return;
      }

      setOrderId(orderData.id);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelection = (method: string) => {
    setSelectedPayment(method);
    // Here you would integrate with actual payment gateways
    toast.success(`Payment with ${method} initiated! 💳`);
    
    setTimeout(() => {
      toast.success('Payment completed successfully! 🎉');
      navigate('/home');
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-md mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-ayur-secondary mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
            <p className="text-gray-600 mb-8">Your order has been placed successfully and will be delivered soon.</p>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Choose Payment Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentSelection('Google Pay')}
                  className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PaymentIcon type="googlepay" className="w-8 h-8" />
                  <span>Pay with Google Pay</span>
                </button>
                
                <button
                  onClick={() => handlePaymentSelection('PhonePe')}
                  className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PaymentIcon type="phonepe" className="w-8 h-8" />
                  <span>Pay with PhonePe</span>
                </button>
                
                <button
                  onClick={() => {
                    toast.success('Cash on Delivery confirmed! 💰');
                    navigate('/home');
                  }}
                  className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Cash on Delivery</span>
                </button>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/home')}
              className="ayur-button w-full"
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ayur-light p-4 pb-20">
      <div className="max-w-md mx-auto pt-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Checkout</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Complete Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-ayur-primary">
                    ₹{(totalPrice + 50 + totalPrice * 0.05).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="ayur-button w-full py-6"
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
