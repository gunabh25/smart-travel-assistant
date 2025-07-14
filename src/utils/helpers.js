// Utility functions for the Smart Travel Assistant

// Distance calculation between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};

// Check if device is online
export const isOnline = () => {
  return navigator.onLine;
};

// Get network connection type
export const getNetworkType = () => {
  if ('connection' in navigator) {
    return navigator.connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

// Check if connection is slow
export const isSlowConnection = () => {
  const connection = navigator.connection;
  if (!connection) return false;
  
  const slowTypes = ['slow-2g', '2g'];
  return slowTypes.includes(connection.effectiveType);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Format timestamp
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate coordinates
export const isValidCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
};

// Get current position with timeout
export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
      ...options
    };

    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      defaultOptions
    );
  });
};

// Convert coordinates to address (mock implementation)
export const reverseGeocode = async (lat, lon) => {
  // In a real app, you'd use a geocoding service like Google Maps or OpenStreetMap
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        city: 'Unknown City',
        country: 'Unknown Country'
      });
    }, 1000);
  });
};

// Check if service worker is supported
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Register service worker
export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported()) {
    throw new Error('Service Worker not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
};

// Check if app is in standalone mode (PWA)
export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
};

// Show install prompt
export const showInstallPrompt = (deferredPrompt) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    return deferredPrompt.userChoice;
  }
  return Promise.resolve({ outcome: 'dismissed' });
};

// Compress image
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get device info
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language
  };
};

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Animation utilities
export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

// URL utilities
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

export const setQueryParams = (params) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, '', url);
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// Error handling
export const handleError = (error, context = 'Unknown') => {
  console.error(`Error in ${context}:`, error);
  
  if (window.showNotification) {
    window.showNotification({
      type: 'error',
      title: 'Error',
      message: error.message || 'An unexpected error occurred'
    });
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

export default {
  calculateDistance,
  formatDistance,
  isOnline,
  getNetworkType,
  isSlowConnection,
  debounce,
  throttle,
  storage,
  formatTimestamp,
  generateId,
  isValidCoordinates,
  getCurrentPosition,
  reverseGeocode,
  isServiceWorkerSupported,
  registerServiceWorker,
  isStandalone,
  showInstallPrompt,
  compressImage,
  formatFileSize,
  getDeviceInfo,
  hexToRgb,
  rgbToHex,
  easeInOutCubic,
  lerp,
  getQueryParams,
  setQueryParams,
  groupBy,
  sortBy,
  handleError,
  measurePerformance
};