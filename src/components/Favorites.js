'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Star, Trash2, Eye } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('travel-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('travel-favorites', JSON.stringify(updatedFavorites));
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        title: 'Removed from Favorites',
        message: 'Place removed from your favorites list.'
      });
    }
  };

  const viewOnMap = (favorite) => {
    // Dispatch custom event to show location on map
    window.dispatchEvent(new CustomEvent('showLocationOnMap', {
      detail: {
        lat: favorite.lat,
        lon: favorite.lon,
        name: favorite.name
      }
    }));
    
    if (window.showNotification) {
      window.showNotification({
        type: 'info',
        title: 'Location Shown',
        message: `${favorite.name} is now displayed on the map.`
      });
    }
  };

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center"
      >
        <Heart className="w-16 h-16 text-white/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
        <p className="text-white/70">
          Start exploring and save your favorite places to see them here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
        <span className="bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-sm">
          {favorites.length}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <motion.div
            key={favorite.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl mb-3 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white/70" />
            </div>
            
            <h3 className="font-semibold text-white mb-2 truncate">
              {favorite.name}
            </h3>
            
            <p className="text-white/70 text-sm mb-3 line-clamp-2">
              {favorite.description || 'No description available'}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-white/70 text-sm">
                  {favorite.rating || 'N/A'}
                </span>
              </div>
              <span className="text-white/50 text-sm">
                {favorite.category || 'Place'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => viewOnMap(favorite)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeFavorite(favorite.id)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 p-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;