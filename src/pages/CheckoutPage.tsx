
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PaymentIcon from '@/components/PaymentIcons';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryInfo.fullName || !deliveryInfo.address || !deliveryInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        total_amount: totalPrice,
        delivery_address: `${deliveryInfo.address}, ${deliveryInfo.city} ${deliveryInfo.zipCode}`.trim(),
        payment_method: 'Pending Payment',
        status: 'pending_payment',
        order_date: new Date().toISOString()
      };

      console.log('Creating order with data:', orderData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Failed to place order: ' + orderError.message);
        return;
      }

      console.log('Order created successfully:', order);

      // Create order items with better error handling
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        // Try to clean up the order if items failed
        await supabase.from('orders').delete().eq('id', order.id);
        toast.error('Failed to save order items: ' + itemsError.message);
        return;
      }

      console.log('Order items created successfully');

      clearCart();
      setOrderId(order.id);
      setOrderPlaced(true);
      toast.success('Order placed successfully! 🎉');

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (method: 'googlepay' | 'phonepe') => {
    // Simulate payment processing
    toast.success(`Payment via ${method === 'googlepay' ? 'Google Pay' : 'PhonePe'} initiated! 💳`);
    
    // In a real app, this would redirect to actual payment gateway
    setTimeout(() => {
      toast.success('Payment completed successfully! 🎉');
      navigate('/tracking');
    }, 2000);
  };

  if (orderPlaced) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-2xl mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-4">
                Order Confirmed! 🎉
              </h1>
              
              <p className="text-gray-600 mb-6">
                Your order has been placed on {formattedDate}
              </p>
              
              <div className="bg-ayur-light rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-ayur-secondary mb-2">Order Summary</h3>
                <p className="text-gray-600">Order ID: #{orderId}</p>
                <p className="text-gray-600">Total Items: {items.length}</p>
                <p className="text-lg font-bold text-ayur-primary">Total: ₹{totalPrice.toFixed(2)}</p>
              </div>

              {/* Payment Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ayur-secondary mb-4">Complete Your Payment</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => handlePayment('googlepay')}
                    variant="outline"
                    className="w-full p-4 h-auto border-2 hover:border-ayur-primary transition-colors"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <PaymentIcon type="googlepay" className="w-8 h-8" />
                      <span className="font-medium">Pay with Google Pay</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handlePayment('phonepe')}
                    variant="outline"
                    className="w-full p-4 h-auto border-2 hover:border-ayur-primary transition-colors"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <PaymentIcon type="phonepe" className="w-8 h-8" />
                      <span className="font-medium">Pay with PhonePe</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/tracking')}
                  className="ayur-button w-full"
                >
                  Track Your Order
                </Button>
                
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full border-ayur-primary text-ayur-primary hover:bg-ayur-light"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-2xl mx-auto pt-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
            <Button onClick={() => navigate('/shop')} className="ayur-button mt-4">
              Start Shopping
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
            onClick={() => navigate('/cart')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>

          <h1 className="text-3xl font-playfair font-bold text-ayur-secondary mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-ayur-primary">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Full Name*"
                        value={deliveryInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={deliveryInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Phone Number*"
                      value={deliveryInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <Input
                    placeholder="Address*"
                    value={deliveryInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={deliveryInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                    <Input
                      placeholder="ZIP Code"
                      value={deliveryInfo.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="ayur-button w-full h-12 text-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                ) : (
                  `Place Order - ₹${totalPrice.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
