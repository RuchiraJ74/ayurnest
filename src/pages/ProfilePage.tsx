
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Bell, Heart, Clock, LogOut, ChevronRight, Settings, Info, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Define tab content interfaces
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

interface FavoriteItem {
  id: string;
  name: string;
  type: 'product' | 'remedy';
  image: string;
}

interface OrderItem {
  id: string;
  items: string[];
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Mock data for tabs
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Ayurvedic Recipe',
    description: 'Check out our new seasonal Ayurvedic recipe for boosting immunity!',
    date: '2023-04-15',
    read: false
  },
  {
    id: '2',
    title: 'Order Shipped',
    description: 'Your order #AYR-3842 has been shipped and will arrive in 2-3 days.',
    date: '2023-04-12',
    read: true
  },
  {
    id: '3',
    title: 'Weekly Wellness Tip',
    description: 'Morning oil pulling can help remove toxins and improve oral health.',
    date: '2023-04-10',
    read: true
  }
];

const mockFavorites: FavoriteItem[] = [
  {
    id: '1',
    name: 'Turmeric Golden Milk',
    type: 'remedy',
    image: 'https://images.unsplash.com/photo-1578520046912-d44eb6294f90?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: '2',
    name: 'Ashwagandha Capsules',
    type: 'product',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: '3',
    name: 'Coconut-Aloe Hair Mask',
    type: 'remedy',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

const mockOrders: OrderItem[] = [
  {
    id: 'AYR-3842',
    items: ['Ashwagandha Capsules', 'Neem & Tulsi Soap'],
    total: 28.98,
    date: '2023-04-12',
    status: 'shipped'
  },
  {
    id: 'AYR-3721',
    items: ['Ayurvedic Hair Oil', 'Brahmi Brain Tonic', 'Copper Water Bottle'],
    total: 77.97,
    date: '2023-03-28',
    status: 'delivered'
  },
  {
    id: 'AYR-3615',
    items: ['Herbal Digestive Tea', 'Triphala Powder'],
    total: 30.98,
    date: '2023-03-15',
    status: 'delivered'
  }
];

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Notifications</h2>
            {mockNotifications.length > 0 ? (
              mockNotifications.map(notification => (
                <Card key={notification.id} className={`p-4 ${!notification.read ? 'border-l-4 border-l-ayur-primary' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-ayur-primary mt-2"></div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No notifications yet</p>
            )}
          </div>
        );
      
      case 'favorites':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">My Favorites</h2>
            {mockFavorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mockFavorites.map(favorite => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img 
                          src={favorite.image} 
                          alt={favorite.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{favorite.name}</h3>
                          <span className="text-xs bg-ayur-light text-ayur-primary px-2 py-1 rounded-full">
                            {favorite.type === 'product' ? 'Product' : 'Remedy'}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-ayur-primary mt-2 p-0 h-auto"
                          onClick={() => navigate(favorite.type === 'product' ? `/shop/${favorite.id}` : `/remedies/${favorite.id}`)}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No favorites saved yet</p>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Order History</h2>
            {mockOrders.length > 0 ? (
              mockOrders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.date}</p>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-2">Items:</div>
                    <ul className="text-sm space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                    <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Order Details",
                        description: `Viewing details for order #${order.id}`,
                      })}
                    >
                      View Details
                    </Button>
                    {order.status === 'shipped' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: "Tracking Information",
                          description: "Your order is on the way and will arrive in 2-3 days.",
                        })}
                      >
                        Track Order
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No orders placed yet</p>
            )}
          </div>
        );
      
      case 'account':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Account Settings</h2>
            <Card className="p-4">
              <h3 className="font-medium mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Username</label>
                  <div className="flex justify-between items-center">
                    <span>{user?.username}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast({
                        title: "Edit Username",
                        description: "Username edit functionality coming soon.",
                      })}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex justify-between items-center">
                    <span>{user?.email}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast({
                        title: "Edit Email",
                        description: "Email edit functionality coming soon.",
                      })}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Password</label>
                  <div className="flex justify-between items-center">
                    <span>••••••••</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast({
                        title: "Change Password",
                        description: "Password change functionality coming soon.",
                      })}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-3">Notification Preferences</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Email Notifications</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Notification Settings",
                      description: "Notification preferences updated.",
                    })}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Push Notifications</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Notification Settings",
                      description: "Notification preferences updated.",
                    })}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'about':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">About AyurNest</h2>
            <Card className="p-4">
              <div className="mx-auto w-16 h-16 bg-ayur-light rounded-full flex items-center justify-center mb-4">
                <img src="/logo.png" alt="AyurNest Logo" className="w-10 h-10" onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40?text=AN";
                }} />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">AyurNest</h3>
              <p className="text-center text-sm text-gray-600 mb-6">Version 1.0.0</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-600">
                    AyurNest is dedicated to making Ayurvedic wellness accessible to everyone. 
                    We believe in the ancient wisdom of Ayurveda and its power to create balance 
                    and harmony in modern lives.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">What is Ayurveda?</h4>
                  <p className="text-sm text-gray-600">
                    Ayurveda is a 5,000-year-old system of natural healing that originated
                    in India. It emphasizes balance between body, mind, and spirit for
                    optimal health. According to Ayurveda, each person has a unique combination
                    of three doshas—Vata, Pitta, and Kapha—which determine individual traits
                    and health tendencies.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contact Us</h4>
                  <p className="text-sm text-gray-600">
                    Email: support@ayurnest.com<br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    className="mx-2"
                    onClick={() => toast({
                      title: "Privacy Policy",
                      description: "Viewing privacy policy...",
                    })}
                  >
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="mx-2"
                    onClick={() => toast({
                      title: "Terms of Service",
                      description: "Viewing terms of service...",
                    })}
                  >
                    Terms of Service
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'profile':
      default:
        return (
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="divide-y">
                  <ProfileMenuItem 
                    icon={Bell} 
                    title="Notifications" 
                    description="Manage your alerts and notifications"
                    onClick={() => setActiveTab('notifications')}
                  />
                  <ProfileMenuItem 
                    icon={Heart} 
                    title="My Favorites" 
                    description="View your saved remedies and products"
                    onClick={() => setActiveTab('favorites')}
                  />
                  <ProfileMenuItem 
                    icon={ShoppingBag} 
                    title="Order History" 
                    description="Check your previous orders"
                    onClick={() => setActiveTab('orders')}
                  />
                </div>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <div className="divide-y">
                  <ProfileMenuItem 
                    icon={Clock} 
                    title="Dosha Assessment" 
                    description="Retake your Dosha quiz"
                    onClick={() => navigate('/dosha-test')}
                  />
                  <ProfileMenuItem 
                    icon={Settings} 
                    title="Account Settings" 
                    description="Manage your account preferences"
                    onClick={() => setActiveTab('account')}
                  />
                  <ProfileMenuItem 
                    icon={Info} 
                    title="About AyurNest" 
                    description="Learn more about our mission"
                    onClick={() => setActiveTab('about')}
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        );
    }
  };
  
  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };
  
  const renderSettingsMenu = () => {
    if (!showSettings) return null;
    
    return (
      <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg z-10">
        <ul className="py-1">
          <li>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setActiveTab('account');
                setShowSettings(false);
              }}
            >
              Account Settings
            </button>
          </li>
          <li>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                toast({
                  title: "Theme Settings",
                  description: "Theme settings coming soon",
                });
                setShowSettings(false);
              }}
            >
              Appearance
            </button>
          </li>
          <li>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleLogoutConfirm();
                setShowSettings(false);
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center relative"
      >
        {activeTab !== 'profile' ? (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => setActiveTab('profile')}
            >
              <ChevronRight className="transform rotate-180" size={20} />
            </Button>
            <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        ) : (
          <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">Profile</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </Button>
        {renderSettingsMenu()}
      </motion.div>
      
      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-ayur-light rounded-full flex items-center justify-center">
                <User size={30} className="text-ayur-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium">{user?.username || 'Guest'}</h2>
                <p className="text-gray-500">{user?.email || 'guest@example.com'}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500">Dosha Type</h3>
                  <p className="font-medium">{user?.dosha ? user.dosha.toUpperCase() : 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Member Since</h3>
                  <p className="font-medium">{user?.joinDate || 'April 2023'}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {renderTabContent()}
      
      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 mt-6"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </motion.div>
      )}
    </div>
  );
};

interface ProfileMenuItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button 
      className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="bg-ayur-light rounded-full p-2">
          <Icon size={18} className="text-ayur-primary" />
        </div>
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );
};

export default ProfilePage;
