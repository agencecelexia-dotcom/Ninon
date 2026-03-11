"use client";

import { create } from "zustand";
import type {
  WizardStep,
  DestinationProposal,
  UserPreferences,
  FlightOption,
  HotelOption,
  ActivityOption,
  RestaurantOption,
  ItineraryDay,
  TripSummary,
} from "@/types/soleil";

interface WizardStore {
  // Current step
  step: WizardStep;
  setStep: (step: WizardStep) => void;

  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;

  // Step 1: Destination proposals
  destinations: DestinationProposal[];
  setDestinations: (destinations: DestinationProposal[]) => void;

  // User preferences
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;

  // Step 3: Flight options
  flights: FlightOption[];
  setFlights: (flights: FlightOption[]) => void;
  selectedFlight: FlightOption | null;
  selectFlight: (flight: FlightOption) => void;

  // Step 4: Hotel options
  hotels: HotelOption[];
  setHotels: (hotels: HotelOption[]) => void;
  selectedHotel: HotelOption | null;
  selectHotel: (hotel: HotelOption) => void;

  // Step 5: Activities
  activities: ActivityOption[];
  setActivities: (activities: ActivityOption[]) => void;
  selectedActivities: ActivityOption[];
  toggleActivity: (activity: ActivityOption) => void;

  // Step 6: Restaurants
  restaurants: RestaurantOption[];
  setRestaurants: (restaurants: RestaurantOption[]) => void;
  selectedRestaurants: RestaurantOption[];
  toggleRestaurant: (restaurant: RestaurantOption) => void;

  // Final summary
  itinerary: ItineraryDay[];
  setItinerary: (itinerary: ItineraryDay[]) => void;
  getTripSummary: () => TripSummary | null;

  // Reset
  reset: () => void;
}

const initialPreferences: UserPreferences = {
  travelers: 2,
  budget: "confort",
  interests: [],
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  step: "welcome",
  isLoading: false,
  loadingMessage: "",
  destinations: [],
  preferences: { ...initialPreferences },
  flights: [],
  selectedFlight: null,
  hotels: [],
  selectedHotel: null,
  activities: [],
  selectedActivities: [],
  restaurants: [],
  selectedRestaurants: [],
  itinerary: [],

  setStep: (step) => set({ step }),
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingMessage: (loadingMessage) => set({ loadingMessage }),
  setDestinations: (destinations) => set({ destinations }),

  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),

  setFlights: (flights) => set({ flights }),
  selectFlight: (flight) => set({ selectedFlight: flight }),

  setHotels: (hotels) => set({ hotels }),
  selectHotel: (hotel) => set({ selectedHotel: hotel }),

  setActivities: (activities) => set({ activities }),
  toggleActivity: (activity) =>
    set((state) => {
      const exists = state.selectedActivities.find((a) => a.id === activity.id);
      return {
        selectedActivities: exists
          ? state.selectedActivities.filter((a) => a.id !== activity.id)
          : [...state.selectedActivities, activity],
      };
    }),

  setRestaurants: (restaurants) => set({ restaurants }),
  toggleRestaurant: (restaurant) =>
    set((state) => {
      const exists = state.selectedRestaurants.find((r) => r.id === restaurant.id);
      return {
        selectedRestaurants: exists
          ? state.selectedRestaurants.filter((r) => r.id !== restaurant.id)
          : [...state.selectedRestaurants, restaurant],
      };
    }),

  setItinerary: (itinerary) => set({ itinerary }),

  getTripSummary: () => {
    const state = get();
    if (!state.preferences.destination) return null;

    const flightCost = state.selectedFlight?.price_eur || 0;
    const hotelCost = (state.selectedHotel?.total_price || 0);
    const actCost = state.selectedActivities.reduce((s, a) => s + a.price_eur, 0);
    const restCost = state.selectedRestaurants.reduce((s, r) => s + r.price_avg, 0);

    return {
      destination: state.preferences.destination,
      preferences: state.preferences,
      flight: state.selectedFlight || undefined,
      hotel: state.selectedHotel || undefined,
      activities: state.selectedActivities,
      restaurants: state.selectedRestaurants,
      total_budget: flightCost + hotelCost + actCost + restCost,
      itinerary: state.itinerary,
    };
  },

  reset: () =>
    set({
      step: "welcome",
      isLoading: false,
      loadingMessage: "",
      destinations: [],
      preferences: { ...initialPreferences },
      flights: [],
      selectedFlight: null,
      hotels: [],
      selectedHotel: null,
      activities: [],
      selectedActivities: [],
      restaurants: [],
      selectedRestaurants: [],
      itinerary: [],
    }),
}));
