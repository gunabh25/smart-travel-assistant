'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';

export default function MapComponent({ currentLocation, nearbyPlaces }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      // Dynamically import Leaflet
      import('leaflet').then((L) => {
        // Fix for default markers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const newMap = L.map(mapRef.current).setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(newMap);

        setMap(newMap);
      });
    }
  }, [map]);

  useEffect(() => {
    if (map && currentLocation) {
      map.setView([currentLocation.latitude, currentLocation.longitude], 15);
      
      // Add current location marker
      const L = window.L;
      if (L) {
        // Clear existing markers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Add current location marker
        const currentLocationIcon = L.divIcon({
          className: 'current-location-marker',
          html: `
            <div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse">
              <div class="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([currentLocation.latitude, currentLocation.longitude], { 
          icon: currentLocationIcon 
        }).addTo(map)
          .bindPopup('You are here!')
          .openPopup();
      }
    }
  }, [map, currentLocation]);

  useEffect(() => {
    if (map && nearbyPlaces.length > 0) {
      const L = window.L;
      if (L) {
        // Add nearby places markers
        nearbyPlaces.forEach((place) => {
          const markerIcon = L.divIcon({
            className: 'place-marker',
            html: `
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker(place.coordinates, { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold text-lg">${place.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${place.description}</p>
                <div class="flex items-center gap-2 text-sm">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${place.category}</span>
                  <span class="text-gray-500">${place.distance}</span>
                </div>
              </div>
            `)
            .on('click', () => setSelectedPlace(place));
        });
      }
    }
  }, [map, nearbyPlaces]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnUser = () => {
    if (map && currentLocation) {
      map.setView([currentLocation.latitude, currentLocation.longitude], 15);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96 lg:h-[500px]'} bg-white rounded-2xl shadow-xl overflow-hidden`}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={centerOnUser}
          className="glass-effect p-2 rounded-lg hover:bg-white/30 transition-colors"
          disabled={!currentLocation}
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className="glass-effect p-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </motion.button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="glass-effect px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span className="font-medium text-gray-700">
              {currentLocation ? 'Live Location' : 'Waiting for location...'}
            </span>
          </div>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-full" />

      {!currentLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {isFullscreen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 z-20 glass-effect px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/30 transition-colors"
        >
          ← Back
        </motion.button>
      )}
    </motion.div>
  );
}