import './globals.css';
import { Inter } from 'next/font/google';
import PWAManifest from '../components/PWAManifest';
import NetworkStatus from '../components/NetworkStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://smart-travel-assistant.com'), // ✅ FIXED
  title: 'Smart Travel Assistant',
  description:
    'Your intelligent travel companion for exploring nearby places with real-time location tracking and offline capabilities.',
  keywords: 'travel, assistant, location, map, offline, PWA, geolocation',
  authors: [{ name: 'Smart Travel Assistant Team' }],
  creator: 'Smart Travel Assistant',
  publisher: 'Smart Travel Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Smart Travel Assistant',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  openGraph: {
    title: 'Smart Travel Assistant',
    description: 'Your intelligent travel companion for exploring nearby places',
    url: 'https://smart-travel-assistant.com',
    siteName: 'Smart Travel Assistant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Travel Assistant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Travel Assistant',
    description: 'Your intelligent travel companion for exploring nearby places',
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gradient-to-br from-primary-50 to-secondary-50 min-h-screen`}
      >
        <PWAManifest />
        <NetworkStatus />
        {children}
      </body>
    </html>
  );
}
