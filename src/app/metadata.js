export const metadata = {
  title: 'Smart Travel Assistant | Explore, Track, Discover',
  description: 'A Progressive Web App that helps travelers explore nearby places, track their live location, and stay informed even with poor internet connectivity. Features real-time location tracking, offline support, and intelligent travel recommendations.',
  keywords: [
    'travel app',
    'location tracking',
    'travel assistant',
    'offline maps',
    'PWA',
    'progressive web app',
    'travel guide',
    'nearby places',
    'real-time location',
    'travel recommendations'
  ],
  authors: [{ name: 'Smart Travel Assistant Team' }],
  creator: 'Smart Travel Assistant',
  publisher: 'Smart Travel Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-travel-assistant.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Smart Travel Assistant | Explore, Track, Discover',
    description: 'A Progressive Web App that helps travelers explore nearby places, track their live location, and stay informed even with poor internet connectivity.',
    url: 'https://smart-travel-assistant.vercel.app',
    siteName: 'Smart Travel Assistant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Travel Assistant - Explore, Track, Discover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Travel Assistant | Explore, Track, Discover',
    description: 'A Progressive Web App that helps travelers explore nearby places, track their live location, and stay informed even with poor internet connectivity.',
    images: ['/og-image.jpg'],
    creator: '@smarttravelapp',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Smart Travel Assistant',
    startupImage: [
      {
        url: '/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1668-2224.jpg',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1536-2048.jpg',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1125-2436.jpg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1242-2208.jpg',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-750-1334.jpg',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-640-1136.jpg',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};