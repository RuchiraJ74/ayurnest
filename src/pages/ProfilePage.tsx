
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Bell, Heart, Clock, LogOut, ChevronRight, Settings, Info, ShoppingBag, Edit, Lock, Sliders, Package, FileText, Truck, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { products } from '@/data/productData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// User state mock storage
const USER_STORE_KEY = 'ayurnest_user_preferences';

const getUserPreferences = () => {
  const stored = localStorage.getItem(USER_STORE_KEY);
  if (!stored) return {
    favorites: [],
    notifications: [],
    orders: [],
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true
  };
  return JSON.parse(stored);
};

const saveUserPreferences = (prefs: any) => {
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(prefs));
};

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from URL query param
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'profile');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState<boolean>(false);
  const [showAppearanceDialog, setShowAppearanceDialog] = useState<boolean>(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);
  const [showTermsOfService, setShowTermsOfService] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  
  // User preferences
  const [userPrefs, setUserPrefs] = useState(() => getUserPreferences());
  
  // Form states for account settings
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Order tracking
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<OrderItem | null>(null);
  
  useEffect(() => {
    // Update the URL when the tab changes
    if (activeTab !== 'profile') {
      navigate(`/profile?tab=${activeTab}`, { replace: true });
    } else {
      navigate('/profile', { replace: true });
    }
  }, [activeTab, navigate]);
  
  useEffect(() => {
    // Update active tab from URL when it changes
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Toggle favorite
  const toggleFavorite = (item: FavoriteItem) => {
    const favorites = [...userPrefs.favorites];
    const index = favorites.findIndex(fav => fav.id === item.id && fav.type === item.type);
    
    if (index >= 0) {
      favorites.splice(index, 1);
      toast.success("Removed from favorites");
    } else {
      favorites.push(item);
      toast.success("Added to favorites");
    }
    
    const updatedPrefs = { ...userPrefs, favorites };
    setUserPrefs(updatedPrefs);
    saveUserPreferences(updatedPrefs);
  };
  
  // Add a product to favorites
  const addProductToFavorites = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const favoriteItem: FavoriteItem = {
        id: product.id,
        name: product.name,
        type: 'product',
        image: product.image
      };
      toggleFavorite(favoriteItem);
    }
  };
  
  // Logout functionality
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Submit feedback
  const submitFeedback = () => {
    if (feedback.trim() === '') {
      toast.error("Please enter your feedback");
      return;
    }
    
    toast.success("Thank you for your feedback!");
    setFeedback('');
    setRating(0);
    setShowFeedbackDialog(false);
  };
  
  // Save appearance settings
  const saveAppearanceSettings = () => {
    const updatedPrefs = { 
      ...userPrefs, 
      darkMode: !userPrefs.darkMode 
    };
    setUserPrefs(updatedPrefs);
    saveUserPreferences(updatedPrefs);
    toast.success("Appearance settings saved");
    setShowAppearanceDialog(false);
  };
  
  // Save account settings
  const saveUsername = () => {
    if (username.trim() === '') {
      toast.error("Username cannot be empty");
      return;
    }
    
    // In a real app, this would make an API call
    toast.success("Username updated successfully");
    setShowEditUsername(false);
  };
  
  const saveEmail = () => {
    if (email.trim() === '' || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    
    // In a real app, this would make an API call
    toast.success("Email updated successfully");
    setShowEditEmail(false);
  };
  
  const changePassword = () => {
    if (currentPassword.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error("All fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // In a real app, this would verify the current password and update
    toast.success("Password changed successfully");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
  };
  
  // Save notification preferences
  const toggleEmailNotifications = () => {
    const updatedPrefs = { 
      ...userPrefs, 
      emailNotifications: !userPrefs.emailNotifications 
    };
    setUserPrefs(updatedPrefs);
    saveUserPreferences(updatedPrefs);
    toast.success("Email notification preferences updated");
  };
  
  const togglePushNotifications = () => {
    const updatedPrefs = { 
      ...userPrefs, 
      pushNotifications: !userPrefs.pushNotifications 
    };
    setUserPrefs(updatedPrefs);
    saveUserPreferences(updatedPrefs);
    toast.success("Push notification preferences updated");
  };
  
  // View order details
  const viewOrderDetails = (order: OrderItem) => {
    // In a real app this would fetch the order details
    toast.success(`Viewing details for order #${order.id}`);
  };
  
  // Track order
  const trackOrder = (order: OrderItem) => {
    setTrackingOrder(order);
    setShowOrderTracking(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Notifications</h2>
            {userPrefs.notifications && userPrefs.notifications.length > 0 ? (
              userPrefs.notifications.map((notification: NotificationItem) => (
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
              <Card className="p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-3" size={32} />
                <h3 className="font-medium text-lg mb-2">No notifications yet</h3>
                <p className="text-gray-500">You'll see your notifications here when you receive them.</p>
              </Card>
            )}
          </div>
        );
      
      case 'favorites':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">My Favorites</h2>
            {userPrefs.favorites && userPrefs.favorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {userPrefs.favorites.map((favorite: FavoriteItem) => (
                  <Card key={`${favorite.id}-${favorite.type}`} className="overflow-hidden">
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
                        <div className="flex mt-2 space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-ayur-primary p-0 h-auto"
                            onClick={() => navigate(favorite.type === 'product' ? `/shop/${favorite.id}` : `/remedies/${favorite.id}`)}
                          >
                            View details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 p-0 h-auto"
                            onClick={() => toggleFavorite(favorite)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Heart className="mx-auto text-gray-400 mb-3" size={32} />
                <h3 className="font-medium text-lg mb-2">No favorites yet</h3>
                <p className="text-gray-500">Start adding products and remedies to your favorites.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/shop')}
                >
                  Browse Products
                </Button>
              </Card>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Order History</h2>
            {userPrefs.orders && userPrefs.orders.length > 0 ? (
              userPrefs.orders.map((order: OrderItem) => (
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
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                    {order.status === 'shipped' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => trackOrder(order)}
                      >
                        Track Order
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Package className="mx-auto text-gray-400 mb-3" size={32} />
                <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                <p className="text-gray-500">Your order history will appear here once you make a purchase.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/shop')}
                >
                  Shop Now
                </Button>
              </Card>
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
                      onClick={() => setShowEditUsername(true)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
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
                      onClick={() => setShowEditEmail(true)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
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
                      onClick={() => setShowChangePassword(true)}
                    >
                      <Lock size={16} className="mr-1" /> Change
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-3">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={userPrefs.emailNotifications}
                    onCheckedChange={toggleEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts on your device
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={userPrefs.pushNotifications}
                    onCheckedChange={togglePushNotifications}
                  />
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
                    onClick={() => setShowPrivacyPolicy(true)}
                  >
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="mx-2"
                    onClick={() => setShowTermsOfService(true)}
                  >
                    Terms of Service
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'feedback':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Feedback</h2>
            <Card className="p-4">
              <h3 className="font-medium mb-3">Share Your Thoughts</h3>
              <p className="text-sm text-gray-600 mb-4">
                We'd love to hear your feedback about AyurNest. Your insights help us improve the app experience for everyone.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rating" className="block mb-2">Rate your experience</Label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="feedback" className="block mb-2">Your feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you like or what we could improve..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <Button onClick={submitFeedback} className="w-full">
                  Submit Feedback
                </Button>
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
                    icon={Package} 
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
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <div className="divide-y">
                  <ProfileMenuItem 
                    icon={Truck} 
                    title="Order Tracking" 
                    description="Track the status of your deliveries"
                    onClick={() => navigate('/order-tracking')}
                  />
                  <ProfileMenuItem 
                    icon={MessageSquare} 
                    title="Send Feedback" 
                    description="Share your thoughts and suggestions"
                    onClick={() => setActiveTab('feedback')}
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        );
    }
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
                setShowAppearanceDialog(true);
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
                handleLogout();
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
      
      {/* Edit Username Dialog */}
      <Dialog open={showEditUsername} onOpenChange={setShowEditUsername}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Username</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUsername(false)}>Cancel</Button>
            <Button onClick={saveUsername}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Email Dialog */}
      <Dialog open={showEditEmail} onOpenChange={setShowEditEmail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditEmail(false)}>Cancel</Button>
            <Button onClick={saveEmail}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Button>
            <Button onClick={changePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Appearance Dialog */}
      <Dialog open={showAppearanceDialog} onOpenChange={setShowAppearanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appearance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={userPrefs.darkMode}
                onCheckedChange={() => {
                  const updatedPrefs = { ...userPrefs, darkMode: !userPrefs.darkMode };
                  setUserPrefs(updatedPrefs);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppearanceDialog(false)}>Cancel</Button>
            <Button onClick={saveAppearanceSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rating-dialog" className="block mb-2">Rate your experience</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="feedback-dialog" className="block mb-2">Your feedback</Label>
              <Textarea
                id="feedback-dialog"
                placeholder="Tell us what you like or what we could improve..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
            <Button onClick={submitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Tracking Dialog */}
      <Dialog open={showOrderTracking} onOpenChange={setShowOrderTracking}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Track Your Order</DialogTitle>
          </DialogHeader>
          {trackingOrder && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Order #{trackingOrder.id}</h3>
                  <p className="text-sm text-gray-500">Placed on {trackingOrder.date}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {trackingOrder.status.charAt(0).toUpperCase() + trackingOrder.status.slice(1)}
                </span>
              </div>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <ul className="space-y-6 relative">
                  <li className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
                      <Check size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Order Confirmed</h4>
                      <p className="text-sm text-gray-500">Your order has been received and confirmed.</p>
                      <p className="text-xs text-gray-400 mt-1">{trackingOrder.date}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
                      <Check size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Processing</h4>
                      <p className="text-sm text-gray-500">Your order is being prepared for shipping.</p>
                      <p className="text-xs text-gray-400 mt-1">{trackingOrder.date}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                      <Truck size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Shipped</h4>
                      <p className="text-sm text-gray-500">Your order is on the way.</p>
                      <p className="text-xs text-gray-400 mt-1">Expected delivery: In 2-3 days</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-400">Delivered</h4>
                      <p className="text-sm text-gray-400">Your order will be delivered soon.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Shipping Information</h4>
                <p className="text-sm">Shipping Partner: AyurExpress</p>
                <p className="text-sm">Tracking Number: AE{Math.floor(Math.random() * 10000000)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowOrderTracking(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium">Introduction</h3>
            <p>
              At AyurNest, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our application.
            </p>
            
            <h3 className="font-medium mt-4">Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, such as when you create an account, complete your profile, place orders, or contact customer support. This may include your name, email address, phone number, delivery address, payment information, and your dosha profile.
            </p>
            
            <h3 className="font-medium mt-4">How We Use Your Information</h3>
            <p>
              We use your information to provide, maintain, and improve our services, process transactions, send notifications, and communicate with you about products, services, and promotions.
            </p>
            
            <h3 className="font-medium mt-4">Sharing Your Information</h3>
            <p>
              We do not sell your personal information to third parties. We may share your information with service providers who help us provide our services, such as payment processors and delivery partners.
            </p>
            
            <h3 className="font-medium mt-4">Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h3 className="font-medium mt-4">Your Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal information at any time. You can do this by accessing your account settings or contacting us directly.
            </p>
            
            <h3 className="font-medium mt-4">Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website or through the application.
            </p>
            
            <h3 className="font-medium mt-4">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@ayurnest.com.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacyPolicy(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Terms of Service Dialog */}
      <Dialog open={showTermsOfService} onOpenChange={setShowTermsOfService}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium">Acceptance of Terms</h3>
            <p>
              By accessing or using AyurNest, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
            </p>
            
            <h3 className="font-medium mt-4">User Accounts</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.
            </p>
            
            <h3 className="font-medium mt-4">Use of Services</h3>
            <p>
              You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services to transmit any malicious code, interfere with the operation of our services, or attempt to access areas of our systems that you are not authorized to access.
            </p>
            
            <h3 className="font-medium mt-4">Intellectual Property</h3>
            <p>
              All content, features, and functionality of our application, including but not limited to text, graphics, logos, icons, and images, are owned by AyurNest and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h3 className="font-medium mt-4">Disclaimers</h3>
            <p>
              Our services are provided "as is" without any warranties, express or implied. We do not guarantee that our services will be error-free or uninterrupted, or that any defects will be corrected.
            </p>
            
            <h3 className="font-medium mt-4">Health Information</h3>
            <p>
              The information provided by AyurNest is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a healthcare professional before making any changes to your health regimen.
            </p>
            
            <h3 className="font-medium mt-4">Limitation of Liability</h3>
            <p>
              In no event shall AyurNest be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            
            <h3 className="font-medium mt-4">Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website or through the application.
            </p>
            
            <h3 className="font-medium mt-4">Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at terms@ayurnest.com.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTermsOfService(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Make sure the Check icon is defined since it's used in the order tracking
const Check: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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
