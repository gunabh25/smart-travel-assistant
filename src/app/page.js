'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import MapComponent from '../components/MapComponent';
import TravelCards from '../components/TravelCards';
import LocationTracker from '../components/LocationTracker';
import BackgroundSync from '../components/BackgroundSync';
import ThreeJsBackground from '../components/ThreeJsBackground';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationUpdate = (location) => {
    setCurrentLocation(location);
    // Generate mock nearby places based on location
    const mockPlaces = [
      {
        id: 1,
        name: 'Central Park',
        description: 'Beautiful urban park perfect for walking and relaxation',
        distance: '0.5 km',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
        category: 'Park',
        coordinates: [location.latitude + 0.01, location.longitude + 0.01],
      },
      {
        id: 2,
        name: 'Local Museum',
        description: 'Discover local history and culture',
        distance: '1.2 km',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'Museum',
        coordinates: [location.latitude - 0.01, location.longitude + 0.01],
      },
      {
        id: 3,
        name: 'Riverside Cafe',
        description: 'Cozy cafe with amazing coffee and pastries',
        distance: '0.8 km',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
        category: 'Restaurant',
        coordinates: [location.latitude + 0.005, location.longitude - 0.005],
      },
      {
        id: 4,
        name: 'Historic Church',
        description: 'Beautiful architecture and peaceful atmosphere',
        distance: '1.5 km',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=400&h=300&fit=crop',
        category: 'Historic',
        coordinates: [location.latitude - 0.015, location.longitude - 0.01],
      },
    ];
    setNearbyPlaces(mockPlaces);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      <ThreeJsBackground />
      <BackgroundSync />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <LocationTracker onLocationUpdate={handleLocationUpdate} />
        
        <Hero />
        
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Explore Your Surroundings
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover amazing places near you with real-time location tracking
                and personalized recommendations.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <MapComponent 
                  currentLocation={currentLocation}
                  nearbyPlaces={nearbyPlaces}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <TravelCards places={nearbyPlaces} />
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}