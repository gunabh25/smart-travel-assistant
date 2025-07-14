'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Eye, Droplets } from 'lucide-react';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
      case 'overcast':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock weather data since we don't have a real API key
      // In a real app, you'd use OpenWeatherMap or similar API
      const mockWeatherData = {
        temperature: Math.round(Math.random() * 30 + 10),
        condition: ['sunny', 'cloudy', 'rainy', 'overcast'][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 15 + 5),
        visibility: Math.round(Math.random() * 10 + 5),
        feelsLike: Math.round(Math.random() * 30 + 10),
        location: 'Current Location'
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeather(mockWeatherData);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20"
      >
        <p className="text-red-200 text-center">{error}</p>
      </motion.div>
    );
  }

  if (!weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <p className="text-white/70 text-center">Weather data unavailable</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Weather</h3>
        {getWeatherIcon(weather.condition)}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{weather.temperature}°C</div>
          <div className="text-white/70 capitalize">{weather.condition}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white flex items-center justify-center gap-1">
            <Thermometer className="w-4 h-4" />
            {weather.feelsLike}°C
          </div>
          <div className="text-white/70">Feels like</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-white/70">
            <Droplets className="w-4 h-4" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="text-white/50">Humidity</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-white/70">
            <Wind className="w-4 h-4" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="text-white/50">Wind</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-white/70">
            <Eye className="w-4 h-4" />
            <span>{weather.visibility} km</span>
          </div>
          <div className="text-white/50">Visibility</div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fetchWeather(location?.lat, location?.lon)}
        className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-2 px-4 text-white font-medium transition-colors"
      >
        Refresh Weather
      </motion.button>
    </motion.div>
  );
};

export default WeatherWidget;