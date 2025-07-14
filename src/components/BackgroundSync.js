'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';

export default function BackgroundSync() {
  const [isRunning, setIsRunning] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    let taskId = null;

    const startBackgroundSync = () => {
      if ('requestIdleCallback' in window) {
        const performSync = (deadline) => {
          setIsRunning(true);
          setSyncStatus('syncing');
          
          // Simulate syncing travel data
          syncTravelData(deadline);
        };

        taskId = requestIdleCallback(performSync, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          setIsRunning(true);
          setSyncStatus('syncing');
          syncTravelData({ timeRemaining: () => 50 });
        }, 1000);
      }
    };

    const syncTravelData = async (deadline) => {
      const tasks = [
        { name: 'Travel tips', duration: 1000 },
        { name: 'Map data', duration: 1500 },
        { name: 'Place reviews', duration: 800 },
        { name: 'Weather info', duration: 600 },
        { name: 'Route cache', duration: 1200 },
      ];

      let completedTasks = 0;
      const totalTasks = tasks.length;

      for (const task of tasks) {
        if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          // Simulate task processing
          await new Promise(resolve => setTimeout(resolve, task.duration));
          completedTasks++;
          setSyncProgress((completedTasks / totalTasks) * 100);
        } else {
          break;
        }
      }

      setIsRunning(false);
      setSyncStatus('completed');
      setLastSync(new Date());
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncProgress(0);
      }, 3000);
    };

    // Start initial sync
    startBackgroundSync();

    // Set up periodic sync every 5 minutes
    const interval = setInterval(startBackgroundSync, 5 * 60 * 1000);

    return () => {
      if (taskId) {
        cancelIdleCallback(taskId);
      }
      clearInterval(interval);
    };
  }, []);

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing data...';
      case 'completed':
        return 'Sync completed';
      default:
        return 'Background sync';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {(isRunning || syncStatus !== 'idle') && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="glass-effect p-4 rounded-lg max-w-sm shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {getStatusText()}
                </h3>
                <p className="text-xs text-gray-600">
                  Last sync: {formatLastSync(lastSync)}
                </p>
              </div>
            </div>

            {syncStatus === 'syncing' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(syncProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span>
                {syncStatus === 'syncing' ? 'Updating offline data' : 
                 syncStatus === 'completed' ? 'Data updated successfully' : 
                 'Ready for background sync'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}