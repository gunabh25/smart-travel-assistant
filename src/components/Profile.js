'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Heart, Clock, Settings, Bell, Shield, HelpCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Travel Explorer',
    email: 'explorer@email.com',
    avatar: '',
    joinDate: new Date().toLocaleDateString(),
    favoriteCount: 0,
    visitedPlaces: 0,
    totalDistance: 0
  });

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    offlineMode: false,
    autoSync: true
  });

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('travel-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedSettings = localStorage.getItem('travel-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load favorites count
    const savedFavorites = localStorage.getItem('travel-favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setProfile(prev => ({
        ...prev,
        favoriteCount: favorites.length
      }));
    }
  }, []);

  const updateProfile = (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    localStorage.setItem('travel-profile', JSON.stringify(updatedProfile));
  };

  const updateSettings = (setting, value) => {
    const updatedSettings = { ...settings, [setting]: value };
    setSettings(updatedSettings);
    localStorage.setItem('travel-settings', JSON.stringify(updatedSettings));
    
    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        title: 'Settings Updated',
        message: `${setting} has been ${value ? 'enabled' : 'disabled'}.`
      });
    }
  };

  const stats = [
    { label: 'Favorite Places', value: profile.favoriteCount, icon: Heart, color: 'text-red-500' },
    { label: 'Places Visited', value: profile.visitedPlaces, icon: MapPin, color: 'text-blue-500' },
    { label: 'Total Distance', value: `${profile.totalDistance} km`, icon: Clock, color: 'text-green-500' }
  ];

  const settingsOptions = [
    { 
      key: 'notifications', 
      label: 'Push Notifications', 
      description: 'Receive travel alerts and updates',
      icon: Bell 
    },
    { 
      key: 'locationSharing', 
      label: 'Location Sharing', 
      description: 'Share your location for better recommendations',
      icon: MapPin 
    },
    { 
      key: 'offlineMode', 
      label: 'Offline Mode', 
      description: 'Cache data for offline access',
      icon: Shield 
    },
    { 
      key: 'autoSync', 
      label: 'Auto Sync', 
      description: 'Automatically sync data when online',
      icon: Settings 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-white/70">{profile.email}</p>
            <p className="text-white/50 text-sm">Member since {profile.joinDate}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            Edit Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <h3 className="text-white font-semibold">{stat.label}</h3>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Settings</h3>
        </div>
        
        <div className="space-y-4">
          {settingsOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <option.icon className="w-5 h-5 text-white/70" />
                <div>
                  <h4 className="text-white font-medium">{option.label}</h4>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateSettings(option.key, !settings[option.key])}
                className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                  settings[option.key] 
                    ? 'bg-blue-500 justify-end' 
                    : 'bg-white/20 justify-start'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 bg-white rounded-full mx-0.5"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Help & Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Help & Support</h3>
        </div>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <span className="text-white font-medium">FAQ</span>
          </button>
          <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <span className="text-white font-medium">Contact Support</span>
          </button>
          <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <span className="text-white font-medium">Privacy Policy</span>
          </button>
          <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <span className="text-white font-medium">Terms of Service</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;