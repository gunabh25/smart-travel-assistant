'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Listen for custom notification events
    const handleCustomNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('customNotification', handleCustomNotification);
    
    return () => {
      window.removeEventListener('customNotification', handleCustomNotification);
    };
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        addNotification({
          type: 'success',
          title: 'Notifications Enabled',
          message: 'You will now receive travel updates and alerts.'
        });
      }
    }
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: new Date(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    // Show browser notification if permission granted
    if (permission === 'granted' && 'Notification' in window) {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png'
      });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-100';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-100';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-100';
    }
  };

  // Global notification function
  useEffect(() => {
    window.showNotification = (notification) => {
      addNotification(notification);
    };
  }, []);

  return (
    <>
      {/* Notification Permission Request */}
      {permission === 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-yellow-500" />
              <h3 className="text-white font-semibold">Enable Notifications</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Get notified about travel updates, location changes, and important alerts.
            </p>
            <div className="flex gap-2">
              <button
                onClick={requestPermission}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                Allow
              </button>
              <button
                onClick={() => setPermission('denied')}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`backdrop-blur-md rounded-2xl p-4 border ${getColorClasses(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  {notification.message && (
                    <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationManager;