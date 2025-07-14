'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          animate={{ 
            scale: isOnline ? [1, 1.2, 1] : [1, 0.9, 1],
            rotate: isOnline ? 0 : [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          {isOnline ? (
            <Wifi className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <WifiOff className="w-16 h-16 text-red-500 mx-auto" />
          )}
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
        </h1>

        <p className="text-gray-600 mb-6">
          {isOnline 
            ? 'Great! Your internet connection is back. You can now access all features.'
            : 'No internet connection found. Some features may be limited, but you can still access cached content.'
          }
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isOnline 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isOnline}
          >
            <RefreshCw className="w-5 h-5" />
            <span>{isOnline ? 'Go Back Online' : 'Retry Connection'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Browse Offline Content
          </motion.button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Available Offline:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cached travel destinations</li>
            <li>• Previously viewed maps</li>
            <li>• Saved travel tips</li>
            <li>• Basic location tracking</li>
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </motion.div>
    </div>
  );
}