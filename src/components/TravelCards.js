'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Navigation, Heart, Share2 } from 'lucide-react';

export default function TravelCards({ places }) {
  const [visibleCards, setVisibleCards] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.dataset.index);
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }
          });
        },
        { threshold: 0.1 }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Observe all card elements
    const cardElements = document.querySelectorAll('.travel-card');
    cardElements.forEach((card) => {
      if (observerRef.current) {
        observerRef.current.observe(card);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [places]);

  const toggleLike = (placeId) => {
    setLikedPlaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
      } else {
        newSet.add(placeId);
      }
      return newSet;
    });
  };

  const sharePlace = (place) => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: place.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${place.name} - ${place.description}`);
    }
  };

  const getNavigationUrl = (place) => {
    const [lat, lng] = place.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  if (!places.length) {
    return (
      <div className="h-96 lg:h-[500px] flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No places found nearby</p>
          <p className="text-gray-400 text-sm mt-2">Try enabling location services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 lg:h-[500px] overflow-y-auto scrollbar-hide">
      <div className="space-y-4">
        <AnimatePresence>
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              data-index={index}
              className="travel-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: visibleCards.includes(index) ? 1 : 0,
                y: visibleCards.includes(index) ? 0 : 20 
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TravelCard
                place={place}
                isLiked={likedPlaces.has(place.id)}
                onToggleLike={toggleLike}
                onShare={sharePlace}
                onNavigate={getNavigationUrl}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TravelCard({ place, isLiked, onToggleLike, onShare, onNavigate }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      'Park': 'bg-green-100 text-green-800',
      'Museum': 'bg-purple-100 text-purple-800',
      'Restaurant': 'bg-orange-100 text-orange-800',
      'Historic': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
    >
      <div className="relative">
        {!imageError ? (
          <div className="relative h-48 bg-gray-200">
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer" />
            )}
            <img
              src={place.image}
              alt={place.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleLike(place.id)}
            className={`glass-effect p-2 rounded-full ${
              isLiked ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(place)}
            className="glass-effect p-2 rounded-full text-gray-600"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(place.category)}`}>
            {place.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 ml-4">
            {renderStars(place.rating)}
            <span className="text-sm text-gray-600 ml-1">({place.rating})</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">
          {place.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{place.distance}</span>
          </div>

          <motion.a
            href={onNavigate(place)}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}