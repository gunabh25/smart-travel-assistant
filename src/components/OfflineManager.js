/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Trash2, 
  RefreshCw, 
  HardDrive,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [offlineContent, setOfflineContent] = useState([]);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [syncStatus, setSyncStatus] = useState('idle');
  const [downloadProgress, setDownloadProgress] = useState({});

  // Initialize offline manager
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineContent();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline content from storage
    loadOfflineContent();
    checkStorageUsage();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline content from localStorage
  const loadOfflineContent = () => {
    try {
      const stored = localStorage.getItem('offlineContent');
      if (stored) {
        setOfflineContent(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline content:', error);
    }
  };

  // Check storage usage
  const checkStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageUsage({
          used: estimate.usage || 0,
          total: estimate.quota || 0
        });
      } catch (error) {
        console.error('Error checking storage:', error);
      }
    }
  };

  // Download content for offline use
  const downloadContent = async (item) => {
    setDownloadProgress(prev => ({ ...prev, [item.id]: 0 }));
    
    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => ({
          ...prev,
          [item.id]: Math.min((prev[item.id] || 0) + 10, 100)
        }));
      }, 200);

      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      
      // Add to offline content
      const newContent = {
        ...item,
        downloadedAt: new Date().toISOString(),
        size: Math.floor(Math.random() * 5000000) + 1000000, // Random size
        status: 'downloaded'
      };
      
      const updated = [...offlineContent, newContent];
      setOfflineContent(updated);
      localStorage.setItem('offlineContent', JSON.stringify(updated));
      
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[item.id];
        return newProgress;
      });
      
      checkStorageUsage();
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[item.id];
        return newProgress;
      });
    }
  };

  // Remove offline content
  const removeOfflineContent = (id) => {
    const updated = offlineContent.filter(item => item.id !== id);
    setOfflineContent(updated);
    localStorage.setItem('offlineContent', JSON.stringify(updated));
    checkStorageUsage();
  };

  // Sync offline content
  const syncOfflineContent = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updated = offlineContent.map(item => ({
        ...item,
        lastSynced: new Date().toISOString()
      }));
      
      setOfflineContent(updated);
      localStorage.setItem('offlineContent', JSON.stringify(updated));
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  // Clear all offline content
  const clearAllOfflineContent = () => {
    setOfflineContent([]);
    localStorage.removeItem('offlineContent');
    checkStorageUsage();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Sample downloadable content
  const sampleContent = [
    {
      id: 1,
      title: 'Paris Travel Guide',
      type: 'guide',
      size: 2500000,
      description: 'Complete offline guide for Paris including maps and attractions'
    },
    {
      id: 2,
      title: 'Local Restaurant Reviews',
      type: 'reviews',
      size: 1200000,
      description: 'Reviews and ratings for nearby restaurants'
    },
    {
      id: 3,
      title: 'Transportation Maps',
      type: 'maps',
      size: 3800000,
      description: 'Offline maps for public transportation'
    },
    {
      id: 4,
      title: 'Weather Forecasts',
      type: 'weather',
      size: 800000,
      description: '7-day weather forecast for current location'
    },
    {
      id: 5,
      title: 'Currency Exchange Rates',
      type: 'currency',
      size: 500000,
      description: 'Latest exchange rates for travel calculations'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'guide': return <MapPin className="w-5 h-5" />;
      case 'reviews': return <Star className="w-5 h-5" />;
      case 'maps': return <MapPin className="w-5 h-5" />;
      case 'weather': return <Clock className="w-5 h-5" />;
      case 'currency': return <RefreshCw className="w-5 h-5" />;
      default: return <Download className="w-5 h-5" />;
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Offline Manager
        </h2>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Storage Usage
            </h3>
          </div>
          <button
            onClick={clearAllOfflineContent}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear All
          </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${storageUsage.total ? (storageUsage.used / storageUsage.total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{formatFileSize(storageUsage.used)} used</span>
          <span>{formatFileSize(storageUsage.total)} total</span>
        </div>
      </div>

      {/* Sync Status */}
      <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          {getSyncStatusIcon()}
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {syncStatus === 'syncing' && 'Syncing...'}
            {syncStatus === 'success' && 'Sync completed'}
            {syncStatus === 'error' && 'Sync failed'}
            {syncStatus === 'idle' && 'Ready to sync'}
          </span>
        </div>
        <button
          onClick={syncOfflineContent}
          disabled={!isOnline || syncStatus === 'syncing'}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Sync Now
        </button>
      </div>

      {/* Downloaded Content */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Downloaded Content ({offlineContent.length})
        </h3>
        {offlineContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No offline content downloaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offlineContent.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(item.size)}</span>
                        <span>Downloaded: {new Date(item.downloadedAt).toLocaleDateString()}</span>
                        {item.lastSynced && (
                          <span>Synced: {new Date(item.lastSynced).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeOfflineContent(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Available for Download */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available for Download
        </h3>
        <div className="space-y-3">
          {sampleContent
            .filter(item => !offlineContent.find(offline => offline.id === item.id))
            .map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-500 rounded-lg text-white">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(item.size)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {downloadProgress[item.id] !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${downloadProgress[item.id]}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {downloadProgress[item.id]}%
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => downloadContent(item)}
                        disabled={!isOnline}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Offline Mode
            </h3>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            You&apos;re currently offline. Only downloaded content is available. Connect to internet to download more content and sync updates.
          </p>
        </motion.div>
      )}
    </div>
  );
}