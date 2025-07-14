import { NextResponse } from 'next/server';

// Mock travel data - in a real app, this would come from a database
const travelData = {
  destinations: [
    {
      id: 1,
      name: "Paris, France",
      type: "city",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500&h=300&fit=crop",
      description: "The City of Light offers world-class museums, iconic landmarks, and romantic ambiance.",
      rating: 4.8,
      coordinates: { lat: 48.8566, lng: 2.3522 },
      attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
      tips: ["Best visited in spring or fall", "Book museum tickets in advance", "Try local patisseries"],
      weather: { temp: 18, condition: "partly cloudy" }
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      type: "city",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
      description: "A fascinating blend of ultra-modern technology and traditional culture.",
      rating: 4.9,
      coordinates: { lat: 35.6762, lng: 139.6503 },
      attractions: ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing"],
      tips: ["Get a JR Pass for transportation", "Learn basic Japanese phrases", "Try street food in Harajuku"],
      weather: { temp: 22, condition: "sunny" }
    },
    {
      id: 3,
      name: "New York City, USA",
      type: "city",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop",
      description: "The city that never sleeps, offering endless entertainment and cultural experiences.",
      rating: 4.7,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      attractions: ["Central Park", "Statue of Liberty", "Times Square"],
      tips: ["Use subway for easy transportation", "Book Broadway shows early", "Visit during shoulder seasons"],
      weather: { temp: 15, condition: "cloudy" }
    },
    {
      id: 4,
      name: "Bali, Indonesia",
      type: "island",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop",
      description: "Tropical paradise with stunning beaches, rich culture, and spiritual atmosphere.",
      rating: 4.6,
      coordinates: { lat: -8.4095, lng: 115.1889 },
      attractions: ["Tanah Lot Temple", "Ubud Rice Terraces", "Mount Batur"],
      tips: ["Respect local customs", "Bargain at local markets", "Try traditional Balinese cuisine"],
      weather: { temp: 28, condition: "sunny" }
    },
    {
      id: 5,
      name: "London, England",
      type: "city",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
      description: "Historic city with royal palaces, world-class museums, and vibrant culture.",
      rating: 4.5,
      coordinates: { lat: 51.5074, lng: -0.1278 },
      attractions: ["Big Ben", "British Museum", "Tower of London"],
      tips: ["Always carry an umbrella", "Use Oyster Card for transport", "Visit free museums"],
      weather: { temp: 12, condition: "rainy" }
    },
    {
      id: 6,
      name: "Sydney, Australia",
      type: "city",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      description: "Harbor city with iconic landmarks, beautiful beaches, and outdoor lifestyle.",
      rating: 4.7,
      coordinates: { lat: -33.8688, lng: 151.2093 },
      attractions: ["Opera House", "Harbour Bridge", "Bondi Beach"],
      tips: ["Apply sunscreen regularly", "Try local seafood", "Explore coastal walks"],
      weather: { temp: 25, condition: "sunny" }
    }
  ],
  tips: [
    {
      id: 1,
      title: "Pack Smart",
      content: "Roll clothes instead of folding to save space and prevent wrinkles.",
      category: "packing"
    },
    {
      id: 2,
      title: "Local Currency",
      content: "Always carry some local currency for small vendors and tips.",
      category: "money"
    },
    {
      id: 3,
      title: "Emergency Contacts",
      content: "Save local emergency numbers and embassy contacts in your phone.",
      category: "safety"
    },
    {
      id: 4,
      title: "Travel Insurance",
      content: "Never travel without comprehensive travel insurance coverage.",
      category: "safety"
    },
    {
      id: 5,
      title: "Document Copies",
      content: "Keep digital and physical copies of important documents.",
      category: "documents"
    }
  ],
  nearbyCategories: [
    "restaurants",
    "attractions",
    "hotels",
    "gas_stations",
    "hospitals",
    "pharmacies",
    "banks",
    "shopping_malls"
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let responseData = travelData;
    
    if (type === 'destinations') {
      responseData = {
        destinations: travelData.destinations.slice(0, limit)
      };
    } else if (type === 'tips') {
      responseData = {
        tips: travelData.tips.slice(0, limit)
      };
    } else if (type === 'nearby') {
      responseData = {
        categories: travelData.nearbyCategories
      };
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch travel data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock response based on request type
    if (body.type === 'search') {
      const filtered = travelData.destinations.filter(dest =>
        dest.name.toLowerCase().includes(body.query.toLowerCase()) ||
        dest.description.toLowerCase().includes(body.query.toLowerCase())
      );
      
      return NextResponse.json({ results: filtered });
    }
    
    if (body.type === 'nearby') {
      // Mock nearby places based on coordinates
      const mockPlaces = [
        {
          id: 1,
          name: "Central Park",
          type: "park",
          distance: 0.5,
          rating: 4.8,
          coordinates: { lat: body.lat + 0.01, lng: body.lng + 0.01 }
        },
        {
          id: 2,
          name: "Local Restaurant",
          type: "restaurant",
          distance: 0.3,
          rating: 4.5,
          coordinates: { lat: body.lat - 0.005, lng: body.lng + 0.008 }
        },
        {
          id: 3,
          name: "Shopping Mall",
          type: "shopping",
          distance: 0.8,
          rating: 4.2,
          coordinates: { lat: body.lat + 0.008, lng: body.lng - 0.01 }
        }
      ];
      
      return NextResponse.json({ places: mockPlaces });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}