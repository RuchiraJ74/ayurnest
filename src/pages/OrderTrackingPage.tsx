
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTracking from '@/components/OrderTracking';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_date: string;
  total_amount: number;
  status: 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled';
  delivery_address: string;
  payment_method: string;
  tracking_info?: any;
  location_data?: any;
}

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
        return;
      }

      setOrders(data || []);
      if (data && data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-orange-600 bg-orange-100';
      case 'outForDelivery': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'outForDelivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const simulateStatusUpdate = async (orderId: string, newStatus: string) => {
    const statusOrder = ['processing', 'shipped', 'outForDelivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(selectedOrder?.status || 'processing');
    const newIndex = statusOrder.indexOf(newStatus);
    
    if (newIndex <= currentIndex && newStatus !== 'cancelled') {
      toast.error('Cannot move to a previous status');
      return;
    }

    try {
      const trackingInfo = {
        events: [
          {
            status: 'processing',
            date: selectedOrder?.order_date,
            description: 'Order placed and confirmed'
          }
        ],
        currentStatus: newStatus,
        estimatedDelivery: selectedOrder?.tracking_info?.estimatedDelivery
      };

      if (newStatus === 'shipped') {
        trackingInfo.events.push({
          status: 'shipped',
          date: new Date().toISOString(),
          description: 'Order has been shipped and is on its way'
        });
      }

      if (newStatus === 'outForDelivery') {
        trackingInfo.events.push(
          {
            status: 'shipped',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            description: 'Order has been shipped and is on its way'
          },
          {
            status: 'outForDelivery',
            date: new Date().toISOString(),
            description: 'Order is out for delivery'
          }
        );
      }

      if (newStatus === 'delivered') {
        trackingInfo.events.push(
          {
            status: 'shipped',
            date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            description: 'Order has been shipped and is on its way'
          },
          {
            status: 'outForDelivery',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            description: 'Order is out for delivery'
          },
          {
            status: 'delivered',
            date: new Date().toISOString(),
            description: 'Order has been delivered successfully'
          }
        );
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          tracking_info: trackingInfo,
          location_data: newStatus === 'outForDelivery' ? {
            latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
            longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
            last_updated: new Date().toISOString()
          } : selectedOrder?.location_data
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update order status');
        return;
      }

      await fetchOrders();
      toast.success(`Order status updated to ${getStatusText(newStatus)}! 📦`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-4xl mx-auto pt-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ayur-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-4xl mx-auto pt-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600">Please sign in to track your orders</h2>
            <Button onClick={() => navigate('/login')} className="mt-4 ayur-button">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-4xl mx-auto pt-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-ayur-primary mb-6 hover:text-ayur-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/shop')} className="ayur-button">
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
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary">
              Order Tracking
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                      selectedOrder?.id === order.id
                        ? 'border-ayur-primary bg-ayur-light'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">#{order.id.substring(0, 8)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(order.order_date)}</p>
                    <p className="text-sm font-semibold">₹{order.total_amount.toFixed(2)}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {selectedOrder && (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrderTracking
                    orderId={selectedOrder.id.substring(0, 8)}
                    status={selectedOrder.status}
                    estimatedDelivery={selectedOrder.tracking_info?.estimatedDelivery}
                    lastUpdated={selectedOrder.tracking_info?.events?.[selectedOrder.tracking_info.events.length - 1]?.date || selectedOrder.order_date}
                    currentLocation={selectedOrder.status === 'outForDelivery' ? 'Mumbai, Maharashtra' : undefined}
                    locationData={selectedOrder.location_data}
                    orderDate={selectedOrder.order_date}
                  />
                  
                  {/* Demo Controls */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-sm">Demo Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateStatusUpdate(selectedOrder.id, 'shipped')}
                          disabled={selectedOrder.status !== 'processing'}
                        >
                          Mark as Shipped
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateStatusUpdate(selectedOrder.id, 'outForDelivery')}
                          disabled={!['processing', 'shipped'].includes(selectedOrder.status)}
                        >
                          Out for Delivery
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateStatusUpdate(selectedOrder.id, 'delivered')}
                          disabled={selectedOrder.status === 'delivered'}
                        >
                          Mark as Delivered
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
