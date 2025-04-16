
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  ShoppingBag, 
  PackageCheck, 
  Truck, 
  Check,
  Search,
  Package,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  shippingPrice: number;
  tax: number;
  grandTotal: number;
  address: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  trackingEvents?: {
    status: string;
    timestamp: string;
    location?: string;
    description: string;
  }[];
}

const OrderTrackingPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('ayurnest_orders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      
      // Add tracking events to orders if they don't have them
      const ordersWithTracking = parsedOrders.map((order: Order) => {
        if (!order.trackingEvents) {
          // Generate tracking events based on order status and dates
          const events = [];
          const orderDate = new Date(order.createdAt);
          
          // Order placed
          events.push({
            status: 'Order Placed',
            timestamp: orderDate.toISOString(),
            description: 'Your order has been received and is being processed.'
          });
          
          // Order confirmed
          const confirmDate = new Date(orderDate);
          confirmDate.setHours(confirmDate.getHours() + 2);
          events.push({
            status: 'Order Confirmed',
            timestamp: confirmDate.toISOString(),
            description: 'Your order has been confirmed and is being prepared.'
          });
          
          // Add shipping event if order is shipped or beyond
          if (['shipped', 'outForDelivery', 'delivered'].includes(order.status)) {
            const shipDate = new Date(orderDate);
            shipDate.setHours(shipDate.getHours() + 24);
            events.push({
              status: 'Order Shipped',
              timestamp: shipDate.toISOString(),
              location: 'Ayurvedic Distribution Center',
              description: 'Your order has been packaged and shipped.'
            });
          }
          
          // Add out for delivery event if applicable
          if (['outForDelivery', 'delivered'].includes(order.status)) {
            const deliveryDate = new Date(orderDate);
            deliveryDate.setHours(deliveryDate.getHours() + 72);
            events.push({
              status: 'Out for Delivery',
              timestamp: deliveryDate.toISOString(),
              location: order.address.city,
              description: 'Your order is out for delivery and will arrive today.'
            });
          }
          
          // Add delivered event if applicable
          if (order.status === 'delivered') {
            const completedDate = new Date(orderDate);
            completedDate.setHours(completedDate.getHours() + 76);
            events.push({
              status: 'Delivered',
              timestamp: completedDate.toISOString(),
              location: order.address.city,
              description: 'Your order has been delivered successfully.'
            });
          }
          
          return { ...order, trackingEvents: events };
        }
        return order;
      });
      
      setOrders(ordersWithTracking);
      
      // If there's at least one order, select the first one
      if (ordersWithTracking.length > 0) {
        setSelectedOrder(ordersWithTracking[0]);
      }
    }
  }, []);
  
  const handleSearchOrder = () => {
    if (!searchOrderId.trim()) {
      toast({
        title: "Please enter an order ID",
        description: "Enter your order ID to track your package.",
        variant: "destructive"
      });
      return;
    }
    
    const order = orders.find(o => o.id.toLowerCase() === searchOrderId.toLowerCase());
    
    if (order) {
      setSelectedOrder(order);
    } else {
      toast({
        title: "Order not found",
        description: "We couldn't find an order with that ID. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getTrackingStatusClass = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-700';
      case 'Order Confirmed':
        return 'bg-purple-100 text-purple-700';
      case 'Order Shipped':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return <ShoppingBag size={18} />;
      case 'Order Confirmed':
        return <PackageCheck size={18} />;
      case 'Order Shipped':
        return <Package size={18} />;
      case 'Out for Delivery':
        return <Truck size={18} />;
      case 'Delivered':
        return <Check size={18} />;
      default:
        return <ShoppingBag size={18} />;
    }
  };
  
  const getProgressPercentage = () => {
    if (!selectedOrder || !selectedOrder.trackingEvents) return 0;
    
    const totalSteps = 5; // Order Placed, Confirmed, Shipped, Out for Delivery, Delivered
    const completedSteps = selectedOrder.trackingEvents.length;
    
    return Math.min((completedSteps / totalSteps) * 100, 100);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Order Tracking</h1>
      </div>
      
      <Card className="p-4 mb-6">
        <div className="relative flex mb-4">
          <Input
            placeholder="Enter Order ID (e.g., AYR-12345)"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="pr-12"
          />
          <Button 
            className="absolute right-0 h-full rounded-l-none"
            onClick={handleSearchOrder}
          >
            <Search size={18} />
          </Button>
        </div>
        
        {orders.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Your Recent Orders:</p>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  className={`px-3 py-2 text-sm rounded-full whitespace-nowrap ${
                    selectedOrder?.id === order.id 
                      ? 'bg-ayur-primary text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.id}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-2">No orders found</p>
        )}
      </Card>
      
      {selectedOrder ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-medium">Order {selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                selectedOrder.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                selectedOrder.status === 'outForDelivery' ? 'bg-orange-100 text-orange-700' :
                selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ayur-primary"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Delivery</span>
                <span className="font-medium">{formatDate(selectedOrder.estimatedDelivery)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Items</span>
                <span className="font-medium">{selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'items'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Total</span>
                <span className="font-medium">${selectedOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
          
          {/* Tracking Events */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Tracking History</h2>
            
            <div className="space-y-6">
              {selectedOrder.trackingEvents && selectedOrder.trackingEvents.map((event, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTrackingStatusClass(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    {index < (selectedOrder.trackingEvents?.length || 0) - 1 && (
                      <div className="w-0.5 bg-gray-200 h-full mt-1"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.status}</h3>
                      <span className="text-xs text-gray-500">{formatTime(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(event.timestamp)}</p>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                    )}
                    <p className="text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Delivery Address */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Delivery Address</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{selectedOrder.address.fullName}</p>
              <p>{selectedOrder.address.addressLine1}</p>
              {selectedOrder.address.addressLine2 && <p>{selectedOrder.address.addressLine2}</p>}
              <p>
                {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.pincode}
              </p>
              <p className="mt-2">Phone: {selectedOrder.address.phoneNumber}</p>
            </div>
          </Card>
          
          {/* Order Items */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="space-y-3">
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => {
                toast({
                  title: "Support Request Sent",
                  description: "Our customer service team will contact you shortly.",
                });
              }}
            >
              <MessageSquare size={18} className="mr-2" />
              Contact Support
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/home')}
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      ) : orders.length > 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Select an order to view tracking details</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Button 
            onClick={() => navigate('/shop')}
            className="ayur-button"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
