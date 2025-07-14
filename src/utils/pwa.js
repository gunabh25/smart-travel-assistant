// PWA Utility Functions

export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

export const canInstallPWA = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const subscribeToPush = async (registration) => {
  if (!registration) return null;
  
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
};

export const getNetworkStatus = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return {
      online: navigator.onLine,
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    };
  }
  
  return {
    online: navigator.onLine,
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData
  };
};

export const isLowEndDevice = () => {
  return navigator.hardwareConcurrency <= 2 || 
         (navigator.deviceMemory && navigator.deviceMemory <= 4);
};

export const preloadCriticalAssets = async () => {
  const criticalAssets = [
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/manifest.json'
  ];
  
  const promises = criticalAssets.map(asset => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  });
  
  try {
    await Promise.all(promises);
    console.log('Critical assets preloaded');
  } catch (error) {
    console.error('Failed to preload some assets:', error);
  }
};

export const optimizeForConnection = (connectionType) => {
  const optimizations = {
    'slow-2g': {
      imageQuality: 0.3,
      enableAnimations: false,
      prefetchDistance: 100,
      maxCacheSize: 5 * 1024 * 1024 // 5MB
    },
    '2g': {
      imageQuality: 0.5,
      enableAnimations: false,
      prefetchDistance: 200,
      maxCacheSize: 10 * 1024 * 1024 // 10MB
    },
    '3g': {
      imageQuality: 0.7,
      enableAnimations: true,
      prefetchDistance: 500,
      maxCacheSize: 25 * 1024 * 1024 // 25MB
    },
    '4g': {
      imageQuality: 0.9,
      enableAnimations: true,
      prefetchDistance: 1000,
      maxCacheSize: 50 * 1024 * 1024 // 50MB
    }
  };
  
  return optimizations[connectionType] || optimizations['4g'];
};

export const createOfflineIndicator = () => {
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ef4444;
      color: white;
      padding: 8px;
      text-align: center;
      font-size: 14px;
      z-index: 9999;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    ">
      You're offline. Some features may not work.
    </div>
  `;
  
  document.body.appendChild(indicator);
  
  const updateIndicator = () => {
    const bar = indicator.querySelector('div');
    if (navigator.onLine) {
      bar.style.transform = 'translateY(-100%)';
    } else {
      bar.style.transform = 'translateY(0)';
    }
  };
  
  window.addEventListener('online', updateIndicator);
  window.addEventListener('offline', updateIndicator);
  
  return indicator;
};

export const measurePerformance = (name) => {
  if ('performance' in window) {
    performance.mark(`${name}-start`);
    
    return {
      end: () => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name} took ${measure.duration}ms`);
        
        return measure.duration;
      }
    };
  }
  
  return { end: () => {} };
};