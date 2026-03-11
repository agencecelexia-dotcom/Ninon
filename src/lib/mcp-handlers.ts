// MCP Tool Handlers — Mock data for demo mode
// In production, these would call actual MCP servers

interface ToolInput {
  [key: string]: unknown;
}

const MOCK_FLIGHTS = [
  {
    rank: 1,
    airline: "Vueling",
    price_eur: 89,
    duration: "2h10",
    stops: 0,
    departure_time: "06:30",
    arrival_time: "08:40",
    badge: "💚 Moins cher",
    booking_url: "https://www.vueling.com",
  },
  {
    rank: 2,
    airline: "Ryanair",
    price_eur: 95,
    duration: "2h05",
    stops: 0,
    departure_time: "07:15",
    arrival_time: "09:20",
    badge: "⚡ Plus rapide",
    booking_url: "https://www.ryanair.com",
  },
  {
    rank: 3,
    airline: "easyJet",
    price_eur: 112,
    duration: "2h15",
    stops: 0,
    departure_time: "10:00",
    arrival_time: "12:15",
    badge: "🎯 Meilleur rapport",
    booking_url: "https://www.easyjet.com",
  },
  {
    rank: 4,
    airline: "Air France",
    price_eur: 178,
    duration: "2h00",
    stops: 0,
    departure_time: "14:30",
    arrival_time: "16:30",
    badge: "👑 Premium",
    booking_url: "https://www.airfrance.fr",
  },
  {
    rank: 5,
    airline: "Iberia",
    price_eur: 145,
    duration: "2h20",
    stops: 0,
    departure_time: "18:00",
    arrival_time: "20:20",
    badge: "🔄 Flexible",
    booking_url: "https://www.iberia.com",
  },
];

const MOCK_HOTELS = [
  {
    rank: 1,
    name: "Hotel Cervantes",
    price_night: 67,
    rating: 8.7,
    dist_beach_km: 0,
    dist_center_km: 0.3,
    badge: "☀️ Coup de cœur Soleil",
    booking_url: "https://www.booking.com",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    rank: 2,
    name: "Hostal Plaza",
    price_night: 42,
    rating: 8.2,
    dist_beach_km: 0.5,
    dist_center_km: 0.1,
    badge: "💚 Petit prix",
    booking_url: "https://www.booking.com",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
  {
    rank: 3,
    name: "Casa del Poeta",
    price_night: 89,
    rating: 9.1,
    dist_beach_km: 1.2,
    dist_center_km: 0.0,
    badge: "⭐ Note exceptionnelle",
    booking_url: "https://www.booking.com",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
  },
  {
    rank: 4,
    name: "Apartamentos Sol y Luna",
    price_night: 55,
    rating: 8.4,
    dist_beach_km: 0.2,
    dist_center_km: 0.8,
    badge: "👥 Peu fréquenté",
    booking_url: "https://www.airbnb.com",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  },
  {
    rank: 5,
    name: "Hotel Triana Palace",
    price_night: 125,
    rating: 9.3,
    dist_beach_km: 0.8,
    dist_center_km: 0.2,
    badge: "👑 Premium",
    booking_url: "https://www.hotels.com",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
  },
];

const MOCK_ACTIVITIES = [
  {
    name: "Visite guidée du centre historique",
    category: "culture",
    price_eur: 15,
    duration: "3h",
    rating: 4.8,
  },
  {
    name: "Cours de cuisine locale",
    category: "gastronomie",
    price_eur: 45,
    duration: "3h",
    rating: 4.9,
  },
  {
    name: "Excursion plage & criques secrètes",
    category: "plage",
    price_eur: 25,
    duration: "5h",
    rating: 4.7,
  },
  {
    name: "Randonnée panoramique au coucher du soleil",
    category: "nature",
    price_eur: 20,
    duration: "2h30",
    rating: 4.9,
  },
  {
    name: "Spectacle de flamenco traditionnel",
    category: "culture",
    price_eur: 35,
    duration: "1h30",
    rating: 4.6,
  },
  {
    name: "Tour en kayak le long de la côte",
    category: "aventure",
    price_eur: 30,
    duration: "2h",
    rating: 4.8,
  },
  {
    name: "Marché local & dégustation tapas",
    category: "gastronomie",
    price_eur: 20,
    duration: "2h",
    rating: 4.7,
  },
  {
    name: "Visite des vignobles",
    category: "gastronomie",
    price_eur: 40,
    duration: "4h",
    rating: 4.5,
  },
];

const MOCK_WEATHER = {
  period: "juin",
  avg_temp: 32,
  sun_days: 28,
  rain_risk: 5,
  recommendation: "Idéal — temps chaud et ensoleillé, parfait pour la plage et les visites",
};

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800",
  "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
  "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
  "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?w=800",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800",
  "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800",
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800",
];

const MOCK_TIPS = [
  {
    id: "tip-1",
    text: "Évitez les restaurants sur la place principale — allez dans les petites rues derrière la cathédrale pour de vraies tapas à moitié prix !",
    tag: "bon-plan",
    votes: 42,
    author_id: "anon-123",
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "tip-2",
    text: "Attention aux taxis depuis l'aéroport — prenez le bus navette, c'est 5x moins cher.",
    tag: "piege",
    votes: 38,
    author_id: "anon-456",
    created_at: "2026-02-20T14:00:00Z",
  },
  {
    id: "tip-3",
    text: "Il y a une plage cachée à 15 min à pied du centre, quasi personne ne la connaît. Demandez 'Cala Secreta' aux locaux.",
    tag: "cache",
    votes: 56,
    author_id: "anon-789",
    created_at: "2026-03-01T09:00:00Z",
  },
];

export async function handleToolCall(
  toolName: string,
  toolInput: ToolInput
): Promise<string> {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

  switch (toolName) {
    case "search_flights": {
      const dest = (toolInput.destination as string) || "destination";
      const flights = MOCK_FLIGHTS.map((f) => ({
        ...f,
        booking_url: `${f.booking_url}/search?to=${encodeURIComponent(dest)}`,
      }));
      return JSON.stringify({ flights, source: "google-flights-mcp + amadeus", destination: dest });
    }

    case "search_hotels": {
      const dest = (toolInput.destination as string) || "destination";
      const maxPrice = toolInput.max_price_per_night as number | undefined;
      let hotels = MOCK_HOTELS;
      if (maxPrice) {
        hotels = hotels.filter((h) => h.price_night <= maxPrice);
      }
      return JSON.stringify({ hotels, source: "hotels_mcp_server + amadeus", destination: dest });
    }

    case "get_activities": {
      return JSON.stringify({
        activities: MOCK_ACTIVITIES,
        source: "amadeus-mcp-server",
        destination: toolInput.destination,
      });
    }

    case "get_weather": {
      return JSON.stringify({
        ...MOCK_WEATHER,
        period: (toolInput.period as string) || "juin",
        destination: toolInput.destination,
        source: "mcp-travel-assistant (OpenWeatherMap)",
      });
    }

    case "convert_currency": {
      const amount = (toolInput.amount as number) || 100;
      const rate = 0.92; // Simulated rate
      return JSON.stringify({
        original: amount,
        from: toolInput.from_currency,
        to: toolInput.to_currency,
        converted: Math.round(amount * rate * 100) / 100,
        rate,
        source: "mcp-travel-assistant (ExchangeRate)",
      });
    }

    case "get_photos": {
      return JSON.stringify({
        photos: MOCK_PHOTOS,
        destination: toolInput.destination,
        source: "Unsplash + Pexels",
      });
    }

    case "get_crowd_score": {
      const score = 25 + Math.floor(Math.random() * 40); // 25-65 range
      return JSON.stringify({
        destination: toolInput.destination,
        period: toolInput.period || "juin",
        crowd_score: score,
        is_off_track: score < 40,
        details: score < 40
          ? "Destination peu touristique — idéal pour les voyageurs en quête d'authenticité"
          : "Destination populaire mais avec des coins cachés à découvrir",
        source: "OpenTripMap + Google Trends",
      });
    }

    case "get_tips": {
      const dest = (toolInput.destination as string) || "";
      const tips = MOCK_TIPS.map((t) => ({ ...t, destination: dest }));
      const tag = toolInput.tag as string | undefined;
      const filtered = tag ? tips.filter((t) => t.tag === tag) : tips;
      return JSON.stringify({
        tips: filtered,
        destination: dest,
        source: "Vercel Edge Config",
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}
