'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  Cpu, 
  HardDrive, 
  Wifi,
  Eye,
  Users,
  MapPin,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    networkSpeed: 0,
    renderTime: 0,
    interactionDelay: 0
  });
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    userSessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topLocations: [],
    userActions: []
  });
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false
  });
  const [performanceWarnings, setPerformanceWarnings] = useState([]);
  const frameRef = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const fpsHistory = useRef([]);

  // Performance monitoring
  useEffect(() => {
    const measurePerformance = () => {
      // FPS calculation
      const now = performance.now();
      const delta = now - lastFrameTime.current;
      const fps = Math.round(1000 / delta);
      
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 60) {
        fpsHistory.current.shift();
      }
      
      const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      
      // Memory usage
      const memoryInfo = performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : { used: 0, total: 0, limit: 0 };

      // Network information
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        setConnectionInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false
        });
      }

      // Performance timing
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const renderTime = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;

      setMetrics(prev => ({
        ...prev,
        fps: Math.round(avgFps),
        memory: memoryInfo.used,
        loadTime,
        renderTime,
        networkSpeed: connection ? connection.downlink : 0
      }));

      // Check for performance warnings
      checkPerformanceWarnings(avgFps, memoryInfo, connection);

      lastFrameTime.current = now;
      frameRef.current = requestAnimationFrame(measurePerformance);
    };

    frameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Check for performance warnings
  const checkPerformanceWarnings = (fps, memory, connection) => {
    const warnings = [];

    if (fps < 30) {
      warnings.push({
        type: 'fps',
        message: 'Low frame rate detected',
        severity: 'high',
        value: fps
      });
    }

    if (memory.used > memory.limit * 0.8) {
      warnings.push({
        type: 'memory',
        message: 'High memory usage',
        severity: 'medium',
        value: `${(memory.used / 1024 / 1024).toFixed(1)} MB`
      });
    }

    if (connection && connection.effectiveType === 'slow-2g') {
      warnings.push({
        type: 'network',
        message: 'Slow network connection',
        severity: 'medium',
        value: connection.effectiveType
      });
    }

    setPerformanceWarnings(warnings);
  };

  // Simulate analytics data
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 3),
        userSessions: prev.userSessions + Math.floor(Math.random() * 2),
        bounceRate: Math.random() * 40 + 20,
        avgSessionDuration: Math.random() * 300 + 120,
        topLocations: [
          { city: 'New York', visits: Math.floor(Math.random() * 100) + 50 },
          { city: 'London', visits: Math.floor(Math.random() * 80) + 30 },
          { city: 'Tokyo', visits: Math.floor(Math.random() * 70) + 25 },
          { city: 'Paris', visits: Math.floor(Math.random() * 60) + 20 },
          { city: 'Sydney', visits: Math.floor(Math.random() * 50) + 15 }
        ]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Format time
  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const performanceMetrics = [
    {
      label: 'FPS',
      value: metrics.fps,
      icon: <Activity className="w-5 h-5" />,
      color: metrics.fps > 45 ? 'text-green-600' : metrics.fps > 30 ? 'text-yellow-600' : 'text-red-600',
      bg: metrics.fps > 45 ? 'bg-green-100' : metrics.fps > 30 ? 'bg-yellow-100' : 'bg-red-100'
    },
    {
      label: 'Memory',
      value: formatBytes(metrics.memory),
      icon: <HardDrive className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Load Time',
      value: formatTime(metrics.loadTime),
      icon: <Clock className="w-5 h-5" />,
      color: metrics.loadTime < 3000 ? 'text-green-600' : 'text-orange-600',
      bg: metrics.loadTime < 3000 ? 'bg-green-100' : 'bg-orange-100'
    },
    {
      label: 'Network',
      value: `${connectionInfo.downlink} Mbps`,
      icon: <Wifi className="w-5 h-5" />,
      color: connectionInfo.downlink > 1 ? 'text-green-600' : 'text-red-600',
      bg: connectionInfo.downlink > 1 ? 'bg-green-100' : 'bg-red-100'
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Monitor
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
        </div>
      </div>

      {/* Performance Warnings */}
      {performanceWarnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {performanceWarnings.map((warning, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border-l-4 ${
                warning.severity === 'high' 
                  ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400' 
                  : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${
                  warning.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  warning.severity === 'high' 
                    ? 'text-red-800 dark:text-red-200' 
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {warning.message}
                </span>
                <span className={`text-sm ${
                  warning.severity === 'high' 
                    ? 'text-red-600 dark:text-red-300' 
                    : 'text-yellow-600 dark:text-yellow-300'
                }`}>
                  ({warning.value})
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {metric.label}
              </span>
              <div className={`p-2 rounded-lg ${metric.bg} dark:bg-gray-600`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
            </div>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Information */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Network Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {connectionInfo.effectiveType?.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Type</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {connectionInfo.downlink}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Mbps</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {connectionInfo.rtt}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">RTT (ms)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {connectionInfo.saveData ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Data Saver</div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Analytics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Page Views</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.pageViews.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">User Sessions</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.userSessions.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Bounce Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.bounceRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Avg Session</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatTime(analytics.avgSessionDuration * 1000)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top Locations
          </h3>
          <div className="space-y-2">
            {analytics.topLocations.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {location.city}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(location.visits / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {location.visits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Performance Status
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {performanceWarnings.length === 0 
            ? 'All systems running optimally. Performance is within acceptable parameters.'
            : `${performanceWarnings.length} performance issue(s) detected. Check warnings above.`
          }
        </p>
      </div>
    </div>
  );
}