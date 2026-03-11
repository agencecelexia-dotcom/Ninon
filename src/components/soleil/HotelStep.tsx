"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";
import type { HotelOption } from "@/types/soleil";

function HotelCard({ hotel, selected, onSelect }: { hotel: HotelOption; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`cursor-pointer card-hover bg-white rounded-2xl overflow-hidden selection-ring ${selected ? "selected" : ""}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-sm font-bold text-dark">{hotel.rating}</span>
        </div>
        {hotel.badge && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-accent">{hotel.badge}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-dark">{hotel.name}</h3>
            <p className="text-xs text-dark-muted">{hotel.dist_center} du centre · {"★".repeat(hotel.stars)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-dark">{hotel.price_night}€</p>
            <p className="text-xs text-dark-muted">/nuit</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.map((a) => (
            <span key={a} className="px-2 py-0.5 bg-surface rounded-md text-xs text-dark-muted">
              {a}
            </span>
          ))}
        </div>

        {selected && (
          <div className="mt-3 pt-3 border-t border-surface-border flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF385C" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm font-semibold text-accent">Selectionne · Total: {hotel.total_price}€</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function HotelStep() {
  const { hotels, selectedHotel, selectHotel, setStep, preferences } = useWizardStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-accent">Etape 2</span>
          <span className="text-sm text-dark-muted">sur 4</span>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          Ou dormir a {preferences.destination?.name} ?
        </h1>
        <p className="text-dark-muted mb-8">
          {hotels.length} hebergements selectionnes pour toi
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            selected={selectedHotel?.id === hotel.id}
            onSelect={() => selectHotel(hotel)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep("flights")}
          className="text-sm font-semibold text-dark-muted hover:text-dark transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={() => setStep("activities")}
          disabled={!selectedHotel}
          className="btn-primary px-8"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
