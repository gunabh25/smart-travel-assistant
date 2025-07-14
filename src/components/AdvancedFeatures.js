'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  VolumeX, 
  Volume2, 
  Mic, 
  MicOff, 
  Languages, 
  Compass, 
  Zap,
  Share2,
  QrCode,
  Wallet,
  ShieldCheck
} from 'lucide-react';

export default function AdvancedFeatures() {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOnline, setIsOnline] = useState(true);

  // Initialize advanced features
  useEffect(() => {
    // Battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Online/Offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Device Orientation
    const handleOrientation = (event) => {
      setDeviceOrientation({
        alpha: Math.round(event.alpha || 0),
        beta: Math.round(event.beta || 0),
        gamma: Math.round(event.gamma || 0)
      });
    };

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Voice Recognition
  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        console.log('Voice input:', transcript);
        // Handle voice commands here
      };

      recognition.start();
    }
  };

  // Text-to-Speech
  const speakText = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  // Camera/Photo capture
  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        console.log('Photo captured:', imageData);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  // Share API
  const shareLocation = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'Smart Travel Assistant',
          text: 'Check out my current location!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  // QR Code Scanner (simplified)
  const scanQRCode = () => {
    // This would integrate with a QR code library
    console.log('QR Code scanner activated');
  };

  // Payment Request API (simplified)
  const requestPayment = async () => {
    if ('PaymentRequest' in window) {
      const supportedInstruments = [{
        supportedMethods: 'basic-card',
        data: {
          supportedNetworks: ['visa', 'mastercard'],
          supportedTypes: ['credit', 'debit']
        }
      }];

      const details = {
        total: {
          label: 'Travel Package',
          amount: { currency: 'USD', value: '99.99' }
        }
      };

      try {
        const request = new PaymentRequest(supportedInstruments, details);
        const response = await request.show();
        console.log('Payment response:', response);
      } catch (error) {
        console.error('Payment failed:', error);
      }
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
  ];

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Photo Capture',
      description: 'Take photos of places you visit',
      action: capturePhoto,
      color: 'bg-blue-500'
    },
    {
      icon: isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />,
      title: 'Voice Commands',
      description: 'Control the app with your voice',
      action: startVoiceRecognition,
      color: isListening ? 'bg-red-500' : 'bg-green-500'
    },
    {
      icon: isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />,
      title: 'Text-to-Speech',
      description: 'Listen to travel information',
      action: () => setIsMuted(!isMuted),
      color: isMuted ? 'bg-gray-500' : 'bg-purple-500'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Share Location',
      description: 'Share your travel location',
      action: shareLocation,
      color: 'bg-indigo-500'
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'QR Scanner',
      description: 'Scan QR codes for travel info',
      action: scanQRCode,
      color: 'bg-cyan-500'
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Quick Pay',
      description: 'Pay for travel services',
      action: requestPayment,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Advanced Features
      </h2>

      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {batteryLevel}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {deviceOrientation.alpha}°
          </span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
            onClick={feature.action}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 ${feature.color} rounded-lg text-white`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Device Orientation Visualizer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Device Orientation
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {deviceOrientation.alpha}°
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Alpha</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {deviceOrientation.beta}°
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Beta</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {deviceOrientation.gamma}°
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Gamma</div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            Privacy Notice
          </h3>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Advanced features require device permissions. All data is processed locally and never shared without your consent.
        </p>
      </div>
    </div>
  );
}