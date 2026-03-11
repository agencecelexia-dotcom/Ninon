"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";
import type { RestaurantOption } from "@/types/soleil";

function RestaurantCard({ resto, selected, onToggle }: { resto: RestaurantOption; selected: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onToggle}
      className={`cursor-pointer card-hover bg-white rounded-2xl overflow-hidden selection-ring ${selected ? "selected" : ""}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={resto.image} alt={resto.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold">{resto.name}</p>
          <p className="text-white/80 text-xs">{resto.cuisine}</p>
        </div>
        {resto.badge && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-gold text-[10px]">{resto.badge}</span>
          </div>
        )}
        {selected && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-sm font-semibold text-dark">{resto.rating}</span>
        </div>
        <p className="text-sm font-bold text-dark">~{resto.price_avg}€ <span className="font-normal text-dark-muted text-xs">/pers</span></p>
      </div>
    </motion.div>
  );
}

export function RestaurantStep() {
  const { restaurants, selectedRestaurants, toggleRestaurant, setStep, preferences, setItinerary } = useWizardStore();

  const total = selectedRestaurants.reduce((s, r) => s + r.price_avg, 0);

  const handleContinue = () => {
    // Generate a basic itinerary
    const days = 5;
    const itinerary = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Jour ${i + 1}`,
      morning: i === 0 ? "Arrivee et installation" : "Petit-dejeuner et exploration",
      afternoon: "Decouverte et activites",
      evening: "Diner et detente",
      budget_est: 80,
    }));
    setItinerary(itinerary);
    setStep("summary");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-accent">Etape 4</span>
          <span className="text-sm text-dark-muted">sur 4</span>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          Ou manger a {preferences.destination?.name} ?
        </h1>
        <p className="text-dark-muted mb-8">
          Les meilleurs restos selectionnes par SOLEIL
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {restaurants.map((resto) => (
          <RestaurantCard
            key={resto.id}
            resto={resto}
            selected={selectedRestaurants.some((r) => r.id === resto.id)}
            onToggle={() => toggleRestaurant(resto)}
          />
        ))}
      </div>

      {selectedRestaurants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent-50 rounded-2xl"
        >
          <p className="text-sm font-semibold text-accent">
            {selectedRestaurants.length} resto{selectedRestaurants.length > 1 ? "s" : ""} · Budget: ~{total}€/pers
          </p>
        </motion.div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep("activities")}
          className="text-sm font-semibold text-dark-muted hover:text-dark transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary px-8"
        >
          Voir mon voyage complet
        </button>
      </div>
    </div>
  );
}
