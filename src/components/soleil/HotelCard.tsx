"use client";

import { motion } from "framer-motion";
import type { Hotel } from "@/types/soleil";
import { formatEUR } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favId = `hotel-${hotel.name}-${hotel.price_night}`;
  const saved = isFavorite(favId);

  const toggleFavorite = () => {
    if (saved) {
      removeFavorite(favId);
    } else {
      addFavorite({
        id: favId,
        type: "hotel",
        data: hotel,
        destination: "",
        timestamp: Date.now(),
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        {hotel.image && (
          <div className="sm:w-40 h-32 sm:h-auto bg-soleil-cream-dark overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h5 className="font-bold text-soleil-indigo">{hotel.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-soleil-gold/10 text-soleil-gold-dark">
                  ⭐ {hotel.rating}/10
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-soleil-cream text-soleil-indigo">
                  {hotel.badge}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-soleil-indigo">
                {formatEUR(hotel.price_night)}
              </p>
              <p className="text-xs text-soleil-gray">/nuit</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-soleil-gray mb-3">
            <span>🏖️ Plage: {hotel.dist_beach_km} km</span>
            <span>🏛️ Centre: {hotel.dist_center_km} km</span>
          </div>

          <div className="flex items-center justify-end gap-2">
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
              href={hotel.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-soleil-sky hover:bg-soleil-sky-light text-white text-sm font-medium rounded-lg transition-colors"
            >
              Voir & Réserver
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
