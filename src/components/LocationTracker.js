'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function LocationTracker({ onLocationUpdate }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      startTracking();
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const startTracking = () => {
    setIsTracking(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Cache for 1 minute
    };

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const locationData = {
        latitude,
        longitude,
        accuracy,
        timestamp: new Date().toISOString(),
      };
      
      setLocation(locationData);
      onLocationUpdate(locationData);
      setIsTracking(false);
    };

    const handleError = (error) => {
      let errorMessage = 'Unknown error occurred';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      setError(errorMessage);
      setIsTracking(false);
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Start watching position
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const formatAccuracy = (accuracy) => {
    if (accuracy < 10) return 'High';
    if (accuracy < 100) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-4 z-50 glass-effect p-4 rounded-lg max-w-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-800">Location Tracker</h3>
      </div>

      {isTracking && (
        <div className="flex items-center gap-2 text-yellow-600 mb-2">
          <div className="loading-spinner w-4 h-4" />
          <span className="text-sm">Getting location...</span>
        </div>
      )}

      {location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Location found</span>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Lng: {location.longitude.toFixed(6)}</div>
            <div>Accuracy: {formatAccuracy(location.accuracy)}</div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-2 text-red-600"
        >
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      <div className="flex gap-2 mt-3">
        {!isTracking && !watchId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startTracking}
            className="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Start
          </motion.button>
        )}
        
        {watchId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopTracking}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Stop
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}