'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Wifi } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="hero-background absolute inset-0 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
            Smart Travel
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed text-shadow">
            Your intelligent companion for exploring nearby places with real-time location tracking,
            offline capabilities, and personalized recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <FeatureCard
            icon={<MapPin className="w-8 h-8" />}
            title="Real-time Location"
            description="Track your live location with precision"
          />
          <FeatureCard
            icon={<Navigation className="w-8 h-8" />}
            title="Smart Navigation"
            description="Intelligent route suggestions"
          />
          <FeatureCard
            icon={<Wifi className="w-8 h-8" />}
            title="Offline Ready"
            description="Works even with poor connectivity"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Exploring
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-effect p-6 rounded-2xl text-white max-w-xs"
    >
      <div className="text-yellow-300 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </motion.div>
  );
}