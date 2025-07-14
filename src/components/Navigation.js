'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Map, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X,
  Compass,
  Clock,
  Settings
} from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const quickActions = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/20"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-md border-r border-white/20 z-40 md:hidden"
            >
              <div className="p-6 pt-20">
                <h2 className="text-2xl font-bold text-white mb-8">Smart Travel</h2>
                
                {/* Main Navigation */}
                <div className="space-y-2 mb-8">
                  {navigationItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-500/30 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-white/70 text-sm font-medium mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTabChange(action.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <action.icon className="w-5 h-5" />
                        <span className="font-medium">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 z-30">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-8">Smart Travel</h2>
          
          {/* Main Navigation */}
          <div className="space-y-2 mb-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-500/30 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-white/70 text-sm font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(action.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around items-center py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'text-blue-400'
                  : 'text-white/70'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;