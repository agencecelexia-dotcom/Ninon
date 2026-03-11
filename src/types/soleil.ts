export interface Destination {
  name: string;
  country: string;
  slug: string;
  image?: string;
  emoji?: string;
}

export interface Scores {
  crowd: number;
  price: number;
  beauty: number;
  beach: number;
  activities: number;
  global: number;
}

export interface Weather {
  period: string;
  avg_temp: number;
  sun_days: number;
  rain_risk?: number;
  recommendation: string;
}

export interface Flight {
  rank: number;
  airline: string;
  price_eur: number;
  duration: string;
  stops: number;
  departure_time?: string;
  arrival_time?: string;
  badge: string;
  booking_url: string;
}

export interface Hotel {
  rank: number;
  name: string;
  price_night: number;
  rating: number;
  dist_beach_km: number;
  dist_center_km: number;
  badge: string;
  booking_url: string;
  image?: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  price_range: string;
  rating: number;
  badge?: string;
  image?: string;
}

export interface Activity {
  name: string;
  category: string;
  price_eur: number;
  duration: string;
  rating: number;
  image?: string;
  badge?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  budget_est: number;
}

export interface Tip {
  id: string;
  destination: string;
  text: string;
  tag: "bon-plan" | "piege" | "cache" | "transport" | "food";
  votes: number;
  author_id: string;
  created_at: string;
}

export interface SoleilResponse {
  destination: Destination;
  scores: Scores;
  weather: Weather;
  flights: Flight[];
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  off_track_note: string;
  tips_prompt: string;
  photos?: string[];
}

// ============ WIZARD STEP-BY-STEP TYPES ============

export type WizardStep =
  | "welcome"
  | "destinations"
  | "preferences"
  | "flights"
  | "hotels"
  | "activities"
  | "restaurants"
  | "summary";

export interface DestinationProposal {
  name: string;
  country: string;
  emoji: string;
  image: string;
  tagline: string;
  price_from: number;
  temp_avg: number;
  crowd_level: "low" | "medium" | "high";
  highlights: string[];
  score: number;
}

export interface UserPreferences {
  destination?: DestinationProposal;
  dates?: { from: string; to: string };
  budget?: "economique" | "confort" | "premium";
  travelers?: number;
  interests?: string[];
  vibe?: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  price_eur: number;
  duration: string;
  stops: number;
  departure_time: string;
  arrival_time: string;
  departure_date: string;
  return_date: string;
  badge?: string;
  logo?: string;
  selected?: boolean;
}

export interface HotelOption {
  id: string;
  name: string;
  price_night: number;
  total_price: number;
  rating: number;
  stars: number;
  image: string;
  badge?: string;
  amenities: string[];
  dist_center: string;
  selected?: boolean;
}

export interface ActivityOption {
  id: string;
  name: string;
  category: string;
  price_eur: number;
  duration: string;
  rating: number;
  image: string;
  badge?: string;
  selected?: boolean;
}

export interface RestaurantOption {
  id: string;
  name: string;
  cuisine: string;
  price_avg: number;
  rating: number;
  image: string;
  badge?: string;
  selected?: boolean;
}

export interface TripSummary {
  destination: DestinationProposal;
  preferences: UserPreferences;
  flight?: FlightOption;
  hotel?: HotelOption;
  activities: ActivityOption[];
  restaurants: RestaurantOption[];
  total_budget: number;
  itinerary: ItineraryDay[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  parsedData?: SoleilResponse;
  timestamp: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  destination?: string;
  timestamp: number;
}

export interface FavoriteItem {
  id: string;
  type: "flight" | "hotel" | "destination" | "itinerary";
  data: Flight | Hotel | Destination | ItineraryDay[];
  destination: string;
  timestamp: number;
}

export type PriceLevel = "LOW" | "TYPICAL" | "HIGH";

export type TipTag = Tip["tag"];

export const TIP_TAG_LABELS: Record<TipTag, { emoji: string; label: string }> = {
  "bon-plan": { emoji: "💚", label: "Bon plan" },
  "piege": { emoji: "⚠️", label: "Piège" },
  "cache": { emoji: "🔍", label: "Caché" },
  "transport": { emoji: "🚌", label: "Transport" },
  "food": { emoji: "🍽️", label: "Food" },
};
