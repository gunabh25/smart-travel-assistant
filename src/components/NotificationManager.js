'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Listen for custom notification events
    const handleNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('show-notification', handleNotification);
    
    return () => {
      window.removeEventListener('show-notification', handleNotification);
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
          message: 'You\'ll now receive travel updates and location alerts!'
        });
      }
    }
  };

  const addNotification = (notification) => {
    const id = Date.now();
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
        tag: `notification-${id}`
      });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      {/* Notification Permission Request */}
      {permission === 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm border"
        >
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Enable Notifications</h4>
              <p className="text-sm text-gray-600 mt-1">
                Get travel updates and location alerts
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={requestPermission}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Enable
                </button>
                <button
                  onClick={() => setPermission('denied')}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notification List */}
      <div className="fixed top-4 right-4 z-40 max-w-sm space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`${getColors(notification.type)} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
}

// Helper function to trigger notifications from other components
export const showNotification = (notification) => {
  const event = new CustomEvent('show-notification', { detail: notification });
  window.dispatchEvent(event);
};