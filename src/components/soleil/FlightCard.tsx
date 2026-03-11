"use client";

import { motion } from "framer-motion";
import type { Flight } from "@/types/soleil";
import { formatEUR } from "@/lib/utils";
import { PriceBadge } from "./PriceBadge";
import { useFavoritesStore } from "@/stores/favorites-store";

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favId = `flight-${flight.airline}-${flight.price_eur}`;
  const saved = isFavorite(favId);

  const toggleFavorite = () => {
    if (saved) {
      removeFavorite(favId);
    } else {
      addFavorite({
        id: favId,
        type: "flight",
        data: flight,
        destination: "",
        timestamp: Date.now(),
      });
    }
  };

  const avgPrice = 130;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-soleil-cream flex items-center justify-center text-lg">
              ✈️
            </div>
            <div>
              <p className="font-bold text-soleil-indigo">{flight.airline}</p>
              <p className="text-xs text-soleil-gray">
                {flight.duration} • {flight.stops === 0 ? "Direct" : `${flight.stops} escale${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-soleil-indigo">
              {formatEUR(flight.price_eur)}
            </p>
            <PriceBadge price={flight.price_eur} avgPrice={avgPrice} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-soleil-cream text-soleil-indigo">
            {flight.badge}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                saved
                  ? "text-soleil-sunset bg-red-50"
                  : "text-soleil-gray hover:text-soleil-sunset hover:bg-red-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <a
              href={flight.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-soleil-gold hover:bg-soleil-gold-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              Réserver
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
