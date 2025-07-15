'use client';

import { useEffect } from 'react';

export default function PWAManifest() {
  useEffect(() => {
    // Create manifest.json dynamically
    const manifestData = {
      name: "Smart Travel Assistant",
      short_name: "TravelApp",
      description: "Your intelligent travel companion for exploring nearby places and staying connected",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#3b82f6",
      orientation: "portrait-primary",
      scope: "/",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any"
        }
      ],
      categories: ["travel", "navigation", "utilities"],
      lang: "en-US",
      dir: "ltr",
      screenshots: [
        {
          src: "/screenshot-wide.png",
          sizes: "1280x720",
          type: "image/png",
          form_factor: "wide"
        },
        {
          src: "/screenshot-narrow.png",
          sizes: "375x812",
          type: "image/png",
          form_factor: "narrow"
        }
      ]
    };

    // Create and inject manifest link
    const manifestBlob = new Blob([JSON.stringify(manifestData)], {
      type: 'application/json'
    });
    const manifestURL = URL.createObjectURL(manifestBlob);
    
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestURL;

    // Add PWA meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Smart Travel Assistant' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'mobile-web-app-status-bar-style', content: 'default' },
      { name: 'theme-color', content: '#3b82f6' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
    ];

    metaTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.name = tag.name;
        document.head.appendChild(existingTag);
      }
      existingTag.content = tag.content;
    });

    // Add apple touch icons
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icon-192x192.png';
    document.head.appendChild(appleTouchIcon);

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Cleanup
    return () => {
      URL.revokeObjectURL(manifestURL);
    };
  }, []);

  return null;
}