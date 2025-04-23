
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import FeedbackForm from '@/components/FeedbackForm';
import { Heart, Package, LogOut, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface UserProfile {
  full_name?: string;
  email?: string;
  signup_date?: string;
  delivery_address?: string;
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setUserProfile({
              full_name: profileData.full_name,
              email: profileData.email || user.email,
              signup_date: profileData.signup_date,
              delivery_address: profileData.delivery_address
            });
          }
          
          // Fetch favorites with product details
          const { data: favoritesData, error: favoritesError } = await supabase
            .from('favorites')
            .select('*, products:product_id(*)')
            .eq('user_id', user.id);
            
          if (favoritesError) {
            console.error('Error fetching favorites:', favoritesError);
          } else if (favoritesData) {
            // Map to format we need
            const formattedFavorites = favoritesData.map((fav: any) => ({
              id: fav.id,
              product: fav.products
            }));
            setFavorites(formattedFavorites);
          }
          
          // Fetch orders
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('order_date', { ascending: false });
            
          if (ordersError) {
            console.error('Error fetching orders:', ordersError);
          } else if (ordersData) {
            setOrders(ordersData);
          } else {
            // If no orders in database, check localStorage
            const localOrders = JSON.parse(localStorage.getItem('ayurnest_orders') || '[]');
            setOrders(localOrders);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId);
        
      if (error) {
        console.error('Error removing favorite:', error);
      } else {
        // Update local state
        setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary">My Profile</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => logout()}
          className="flex items-center"
        >
          <LogOut size={16} className="mr-1" />
          Logout
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow">
              <AvatarImage src={user?.avatar} alt={user?.username || ''} />
              <AvatarFallback className="bg-ayur-primary text-white text-lg">
                {user?.username ? getInitials(user.username) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-medium">{userProfile.full_name || user?.username || 'User'}</h2>
              <p className="text-sm text-gray-500">{userProfile.email || user?.email || 'Email not available'}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                <span>Member since {formatDate(userProfile.signup_date)}</span>
              </div>
              {userProfile.delivery_address && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  <span className="line-clamp-1">{userProfile.delivery_address}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites
            {favorites.length > 0 && (
              <Badge className="ml-1 bg-ayur-primary">{favorites.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <FeedbackForm />
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate('/order-tracking')}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt || order.order_date)}
                        </p>
                      </div>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'shipped' ? 'bg-blue-500' :
                        order.status === 'processing' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm">
                        {order.items?.length || 'Multiple'} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                      <p className="font-medium">${parseFloat(order.grandTotal || order.total_amount).toFixed(2)}</p>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Orders Yet</h3>
                <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="space-y-4">
            {favorites.length > 0 ? (
              favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex h-24">
                      <div 
                        className="w-24 bg-gray-100 relative cursor-pointer"
                        onClick={() => navigate(`/shop/${favorite.product.id}`)}
                      >
                        <img 
                          src={favorite.product.image_url || "https://via.placeholder.com/100?text=Ayurvedic"} 
                          alt={favorite.product.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div onClick={() => navigate(`/shop/${favorite.product.id}`)} className="cursor-pointer">
                          <h3 className="font-medium text-sm line-clamp-1">{favorite.product.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{favorite.product.description}</p>
                          <p className="text-sm font-medium text-ayur-primary mt-1">
                            ${parseFloat(favorite.product.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 p-1 h-auto"
                            onClick={() => handleRemoveFavorite(favorite.product.id)}
                          >
                            <Heart className="h-4 w-4 fill-red-500" /> 
                            <span className="ml-1 text-xs">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Favorites Yet</h3>
                <p className="text-gray-500 mb-4">You haven't added any products to your favorites</p>
                <Button onClick={() => navigate('/shop')}>Explore Products</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
