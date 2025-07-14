'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Signal } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('4g');
  const [downlink, setDownlink] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Network Information API
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.type || 'unknown');
        setEffectiveType(connection.effectiveType || '4g');
        setDownlink(connection.downlink || 0);
      }
    };

    // Event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo(); // Initial call
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline';
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'poor';
    if (effectiveType === '3g') return 'fair';
    if (effectiveType === '4g') return 'good';
    
    return 'good';
  };

  const getStatusColor = () => {
    const quality = getConnectionQuality();
    switch (quality) {
      case 'offline': return 'bg-red-500';
      case 'poor': return 'bg-red-400';
      case 'fair': return 'bg-yellow-400';
      case 'good': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    
    const quality = getConnectionQuality();
    switch (quality) {
      case 'poor': return 'Poor Connection';
      case 'fair': return 'Fair Connection';
      case 'good': return 'Good Connection';
      default: return 'Connected';
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    
    const quality = getConnectionQuality();
    if (quality === 'poor') return <Signal className="w-4 h-4" />;
    
    return <Wifi className="w-4 h-4" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          onClick={() => setShowDetails(!showDetails)}
          className={`${getStatusColor()} text-white px-3 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </motion.div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 glass-effect p-4 rounded-lg min-w-48 shadow-xl"
            >
              <h3 className="font-semibold text-gray-800 mb-3">Network Details</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {isOnline && (
                  <>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{connectionType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-medium">{effectiveType.toUpperCase()}</span>
                    </div>
                    
                    {downlink > 0 && (
                      <div className="flex justify-between">
                        <span>Downlink:</span>
                        <span className="font-medium">{downlink.toFixed(1)} Mbps</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Content optimized for {getConnectionQuality()} connection
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}