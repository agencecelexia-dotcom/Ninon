"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";
import type { DestinationProposal } from "@/types/soleil";

function CrowdBadge({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { label: "Peu touristique", className: "badge-emerald" },
    medium: { label: "Moderement visite", className: "badge-gold" },
    high: { label: "Tres visite", className: "badge-accent" },
  };
  const c = config[level];
  return <span className={`badge ${c.className}`}>{c.label}</span>;
}

function DestinationCard({
  dest,
  index,
  onSelect,
}: {
  dest: DestinationProposal;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className="group cursor-pointer"
    >
      <div className="card-hover bg-white rounded-3xl overflow-hidden shadow-card">
        {/* Image */}
        <div className="relative h-52 sm:h-64 overflow-hidden">
          <img
            src={dest.image}
            alt={dest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Score badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-accent font-bold text-sm">{dest.score}</span>
              <span className="text-xs text-dark-muted">/100</span>
            </div>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {dest.emoji} {dest.name}
                </h3>
                <p className="text-white/80 text-sm">{dest.country}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-xs opacity-70">a partir de</p>
                <p className="text-white text-xl font-bold">{dest.price_from}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-dark-muted text-sm italic mb-3">&ldquo;{dest.tagline}&rdquo;</p>

          <div className="flex items-center gap-3 mb-4">
            <CrowdBadge level={dest.crowd_level} />
            <span className="text-sm text-dark-muted">{dest.temp_avg}°C moy.</span>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {dest.highlights.map((h) => (
              <span
                key={h}
                className="px-3 py-1 bg-surface rounded-full text-xs font-medium text-dark-light"
              >
                {h}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-accent group-hover:underline">
              Choisir cette destination
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DestinationStep() {
  const { destinations, isLoading, loadingMessage, setPreferences, setStep, setLoading, setLoadingMessage, setFlights, setHotels, setActivities, setRestaurants } = useWizardStore();

  const handleSelect = async (dest: DestinationProposal) => {
    setPreferences({ destination: dest });
    setLoading(true);
    setLoadingMessage("SOLEIL prepare les meilleures options pour " + dest.name + "...");
    setStep("flights");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_options",
          destination: dest.name,
          country: dest.country,
          dates: useWizardStore.getState().preferences.dates,
          budget: useWizardStore.getState().preferences.budget,
          travelers: useWizardStore.getState().preferences.travelers,
        }),
      });

      if (!response.ok) throw new Error("Erreur API");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") fullText += data.text;
            } catch { /* skip */ }
          }
        }
      }

      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch?.[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.flights) setFlights(parsed.flights);
        if (parsed.hotels) setHotels(parsed.hotels);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.restaurants) setRestaurants(parsed.restaurants);
      }
    } catch (err) {
      console.error("Error fetching options:", err);
    }

    // Fallback data if API didn't return structured data
    const store = useWizardStore.getState();
    if (store.flights.length === 0) {
      setFlights(FALLBACK_FLIGHTS(dest.name));
    }
    if (store.hotels.length === 0) {
      setHotels(FALLBACK_HOTELS(dest.name));
    }
    if (store.activities.length === 0) {
      setActivities(FALLBACK_ACTIVITIES);
    }
    if (store.restaurants.length === 0) {
      setRestaurants(FALLBACK_RESTAURANTS);
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-6">
            <div className="pulse-dot" style={{ animationDelay: "0ms" }} />
            <div className="pulse-dot" style={{ animationDelay: "200ms" }} />
            <div className="pulse-dot" style={{ animationDelay: "400ms" }} />
          </div>
          <p className="text-lg font-semibold text-dark">{loadingMessage}</p>
          <p className="text-sm text-dark-muted mt-2">Analyse en cours avec l&apos;IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">
          Nos recommandations
        </h1>
        <p className="text-dark-muted text-lg">
          SOLEIL a trouve {destinations.length} destinations parfaites pour toi
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {destinations.map((dest, i) => (
          <DestinationCard
            key={dest.name}
            dest={dest}
            index={i}
            onSelect={() => handleSelect(dest)}
          />
        ))}
      </div>
    </div>
  );
}

// Fallback data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FALLBACK_FLIGHTS(dest: string): import("@/types/soleil").FlightOption[] {
  return [
    { id: "f1", airline: "Vueling", price_eur: 89, duration: "2h10", stops: 0, departure_time: "06:30", arrival_time: "08:40", departure_date: "", return_date: "", badge: "Moins cher" },
    { id: "f2", airline: "Ryanair", price_eur: 95, duration: "2h05", stops: 0, departure_time: "07:15", arrival_time: "09:20", departure_date: "", return_date: "", badge: "Plus rapide" },
    { id: "f3", airline: "easyJet", price_eur: 112, duration: "2h15", stops: 0, departure_time: "10:00", arrival_time: "12:15", departure_date: "", return_date: "", badge: "Meilleur rapport" },
    { id: "f4", airline: "Air France", price_eur: 178, duration: "2h00", stops: 0, departure_time: "14:30", arrival_time: "16:30", departure_date: "", return_date: "", badge: "Premium" },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FALLBACK_HOTELS(_dest: string): import("@/types/soleil").HotelOption[] {
  return [
    { id: "h1", name: "Hotel Boutique Central", price_night: 67, total_price: 335, rating: 8.7, stars: 3, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", badge: "Coup de coeur", amenities: ["WiFi", "Piscine", "Petit-dej"], dist_center: "300m" },
    { id: "h2", name: "Hostal Plaza", price_night: 42, total_price: 210, rating: 8.2, stars: 2, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600", badge: "Petit prix", amenities: ["WiFi", "Terrasse"], dist_center: "100m" },
    { id: "h3", name: "Casa del Poeta", price_night: 89, total_price: 445, rating: 9.1, stars: 4, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600", badge: "Top note", amenities: ["WiFi", "Spa", "Piscine", "Petit-dej"], dist_center: "50m" },
    { id: "h4", name: "Apartamentos Sol y Luna", price_night: 55, total_price: 275, rating: 8.4, stars: 3, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600", amenities: ["WiFi", "Cuisine", "Terrasse"], dist_center: "800m" },
  ];
}

const FALLBACK_ACTIVITIES: import("@/types/soleil").ActivityOption[] = [
  { id: "a1", name: "Visite guidee du centre historique", category: "Culture", price_eur: 15, duration: "3h", rating: 4.8, image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400", badge: "Top" },
  { id: "a2", name: "Cours de cuisine locale", category: "Gastronomie", price_eur: 45, duration: "3h", rating: 4.9, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400", badge: "Incontournable" },
  { id: "a3", name: "Excursion criques secretes", category: "Plage", price_eur: 25, duration: "5h", rating: 4.7, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { id: "a4", name: "Randonnee coucher de soleil", category: "Nature", price_eur: 20, duration: "2h30", rating: 4.9, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400" },
  { id: "a5", name: "Tour en kayak", category: "Aventure", price_eur: 30, duration: "2h", rating: 4.8, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
  { id: "a6", name: "Marche local & tapas", category: "Gastronomie", price_eur: 20, duration: "2h", rating: 4.7, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
];

const FALLBACK_RESTAURANTS: import("@/types/soleil").RestaurantOption[] = [
  { id: "r1", name: "La Table Cachee", cuisine: "Mediterraneenne", price_avg: 25, rating: 4.8, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", badge: "Coup de coeur" },
  { id: "r2", name: "Chez Mama", cuisine: "Traditionnelle", price_avg: 15, rating: 4.6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", badge: "Petit prix" },
  { id: "r3", name: "Ocean Terrace", cuisine: "Fruits de mer", price_avg: 35, rating: 4.9, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", badge: "Vue mer" },
  { id: "r4", name: "Street Bites Market", cuisine: "Street food", price_avg: 10, rating: 4.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
];
