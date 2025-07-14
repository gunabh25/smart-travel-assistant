'use client';

import { motion } from 'framer-motion';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      <motion.p
        className="mt-4 text-gray-600 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {message}
      </motion.p>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}