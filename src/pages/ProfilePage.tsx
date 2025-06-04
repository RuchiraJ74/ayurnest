import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Settings, Heart, Package, LogOut, Edit3, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
    emailUpdates: boolean;
  };
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    displayName: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    preferences: {
      darkMode: false,
      notifications: true,
      emailUpdates: true,
    },
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchOrderCount();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      let preferences = { darkMode: false, notifications: true, emailUpdates: true };
      if (data?.preferences && typeof data.preferences === 'object' && data.preferences !== null) {
        const prefData = data.preferences as any;
        preferences = {
          darkMode: prefData.darkMode === true,
          notifications: prefData.notifications !== false,
          emailUpdates: prefData.emailUpdates !== false
        };
      }

      // Get display name from various sources
      const displayName = data?.full_name || 
                          user?.user_metadata?.full_name || 
                          user?.email?.split('@')[0] || 
                          'User';

      setProfile({
        id: user.id,
        displayName: displayName,
        email: user.email || '',
        fullName: data?.full_name || '',
        phoneNumber: data?.phone_number || '',
        deliveryAddress: data?.delivery_address || '',
        preferences: preferences,
        avatar: data?.avatar_url || ''
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching order count:', error);
        return;
      }

      setOrderCount(count || 0);
    } catch (error) {
      console.error('Error in fetchOrderCount:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updateData = {
        id: user.id,
        full_name: profile.fullName || null,
        phone_number: profile.phoneNumber || null,
        delivery_address: profile.deliveryAddress || null,
        preferences: profile.preferences,
        email: profile.email,
        avatar_url: profile.avatar || null
      };

      console.log('Updating profile with data:', updateData);

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile: ' + error.message);
        return;
      }

      setIsEditing(false);
      toast.success('Profile updated successfully! 🌟');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clean up any local storage items that might be causing issues
      localStorage.removeItem('ayurnest_dosha');
      
      // Use direct navigation to force a full page refresh
      window.location.href = '/';
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile(prev => ({
          ...prev,
          avatar: result
        }));
        toast.success('Profile picture updated! Remember to save your changes. 📸');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
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
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
            <h2 className="text-xl font-semibold text-gray-600">Please sign in to view your profile</h2>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center text-ayur-primary hover:text-ayur-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-playfair font-bold text-ayur-secondary">
                My Profile
              </h1>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-ayur-primary text-ayur-primary hover:bg-ayur-light"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profile.avatar} alt="Profile" />
                    <AvatarFallback className="bg-ayur-primary/20 text-ayur-primary text-2xl">
                      {profile.fullName ? profile.fullName.charAt(0) : profile.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-1 bg-ayur-primary text-white rounded-full cursor-pointer hover:bg-ayur-secondary transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-ayur-secondary mb-1">
                  {profile.fullName || profile.displayName}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{profile.email}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{orderCount} Orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <Input
                      value={profile.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <Input
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <Input
                      value={profile.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </label>
                    <Input
                      value={profile.deliveryAddress || ''}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your delivery address"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="ayur-button">
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feedback Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-ayur-secondary mb-1">Share Your Experience</h3>
                  <p className="text-gray-600 text-sm">Help us improve by sharing your feedback</p>
                </div>
                <Button
                  onClick={() => navigate('/feedback')}
                  className="ayur-button"
                >
                  💬 Give Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-ayur-secondary mb-1">Account Actions</h3>
                  <p className="text-gray-600 text-sm">Manage your account settings</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
