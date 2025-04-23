
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Truck, Package, Home, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import MapTracker from './MapTracker';

type OrderTrackingProps = {
  orderId: string;
  status: 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled';
  estimatedDelivery?: string;
  lastUpdated: string;
  currentLocation?: string;
  locationData?: { latitude: number | null; longitude: number | null; last_updated: string | null };
};

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
  estimatedDelivery,
  lastUpdated,
  currentLocation,
  locationData
}) => {
  const navigate = useNavigate();
  
  const getStatusIndex = () => {
    switch (status) {
      case 'processing': return 0;
      case 'shipped': return 1;
      case 'outForDelivery': return 1.5; // Between shipped and delivered
      case 'delivered': return 2;
      case 'cancelled': return -1;
      default: return 0;
    }
  };
  
  const statusIndex = getStatusIndex();
  
  const steps = [
    {
      label: 'Order Processing',
      description: 'Your order has been received and is being processed',
      icon: Package
    },
    {
      label: 'Order Shipped',
      description: 'Your order is on its way to you',
      icon: Truck
    },
    {
      label: 'Order Delivered',
      description: 'Your order has been delivered',
      icon: Home
    }
  ];

  // Format dates using date-fns for accurate display
  const formatEstimatedDelivery = () => {
    if (!estimatedDelivery) return '';
    try {
      return format(new Date(estimatedDelivery), 'MMM d, yyyy');
    } catch (e) {
      console.error("Error formatting estimated delivery date:", e);
      return estimatedDelivery;
    }
  };

  const formatLastUpdated = () => {
    try {
      return format(new Date(lastUpdated), 'MMM d, yyyy h:mm a');
    } catch (e) {
      console.error("Error formatting last updated date:", e);
      return lastUpdated;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-ayur-secondary">Order Tracking</h3>
          <p className="text-sm text-gray-500">Order #{orderId}</p>
        </div>
        
        {status === 'cancelled' ? (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Cancelled
          </span>
        ) : (
          estimatedDelivery && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Estimated Delivery</p>
              <p className="text-sm font-medium flex items-center">
                <Clock size={14} className="mr-1" /> {formatEstimatedDelivery()}
              </p>
            </div>
          )
        )}
      </div>
      
      {locationData && locationData.latitude && locationData.longitude && (
        <div className="mb-6 rounded-lg overflow-hidden h-48">
          <MapTracker 
            latitude={locationData.latitude} 
            longitude={locationData.longitude} 
            orderId={orderId}
            status={status}
          />
        </div>
      )}
      
      {status === 'cancelled' ? (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-red-800">
            This order has been cancelled. If you have any questions, please contact our support team.
          </p>
        </div>
      ) : (
        <div className="relative mb-6 px-2">
          {/* Progress line */}
          <div className="absolute left-6 top-6 h-full w-0.5 bg-gray-200" />
          
          {/* Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= statusIndex;
            const isActive = index === Math.floor(statusIndex) || 
                            (index === 1 && status === 'outForDelivery');
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-start mb-8 relative ${isActive ? 'opacity-100' : isCompleted ? 'opacity-100' : 'opacity-50'}`}
              >
                <div className="mr-4 relative z-10">
                  {isCompleted ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Circle className={isActive ? "text-ayur-primary" : "text-gray-300"} size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${isActive ? 'text-ayur-primary' : 'text-gray-700'}`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  
                  {isActive && currentLocation && (status === 'shipped' || status === 'outForDelivery') && index === 1 && (
                    <div className="mt-2 bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium text-blue-800">Current Location:</p>
                      <p className="text-blue-700 flex items-center">
                        <MapPin size={12} className="mr-1" /> {currentLocation}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Last Updated: {formatLastUpdated()}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/contact-support')}
          >
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
