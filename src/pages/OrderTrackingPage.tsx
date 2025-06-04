
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTracking from '@/components/OrderTracking';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type OrderStatus = 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  payment_method: string;
  order_date: string;
  created_at: string;
  updated_at: string;
  tracking_info: any;
  location_data: any;
}

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
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

      // Transform the data to match our Order interface
      const transformedOrders: Order[] = data.map(order => ({
        ...order,
        status: normalizeStatus(order.status)
      }));

      setOrders(transformedOrders);
      if (transformedOrders.length > 0) {
        setSelectedOrder(transformedOrders[0]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize status values from database
  const normalizeStatus = (status: string): OrderStatus => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'shipped';
      case 'out for delivery':
      case 'outfordelivery':
        return 'outForDelivery';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'processing';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-md mx-auto pt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Please sign in to track your orders</p>
              <Button onClick={() => navigate('/auth')} className="ayur-button">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ayur-light p-4 pb-20">
        <div className="max-w-md mx-auto pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ayur-light p-4 pb-20">
      <div className="max-w-md mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-playfair font-bold text-ayur-secondary flex items-center gap-2">
              <Package className="w-8 h-8" />
              Track Orders
            </h1>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <Button onClick={() => navigate('/shop')} className="ayur-button">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {orders.map((order) => (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            selectedOrder?.id === order.id
                              ? 'border-ayur-primary bg-ayur-light'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Order #{order.id.slice(-8)}</span>
                            <span className="text-sm text-gray-500">
                              ₹{order.total_amount.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedOrder && (
                <OrderTracking
                  orderId={selectedOrder.id}
                  status={selectedOrder.status}
                  estimatedDelivery={selectedOrder.tracking_info?.estimatedDelivery}
                  lastUpdated={selectedOrder.updated_at}
                  currentLocation={selectedOrder.tracking_info?.currentLocation}
                  locationData={selectedOrder.location_data}
                  orderDate={selectedOrder.order_date}
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
