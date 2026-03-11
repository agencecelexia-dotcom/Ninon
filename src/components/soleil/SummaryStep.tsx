"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";

export function SummaryStep() {
  const { preferences, selectedFlight, selectedHotel, selectedActivities, selectedRestaurants, reset } = useWizardStore();

  const dest = preferences.destination;
  if (!dest) return null;

  const flightCost = selectedFlight?.price_eur || 0;
  const hotelCost = selectedHotel?.total_price || 0;
  const actCost = selectedActivities.reduce((s, a) => s + a.price_eur, 0);
  const restCost = selectedRestaurants.reduce((s, r) => s + r.price_avg, 0);
  const totalPerPerson = flightCost + hotelCost + actCost + restCost;
  const totalAll = totalPerPerson * (preferences.travelers || 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero recap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white/70 text-sm mb-1">Ton voyage sur mesure</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            {dest.emoji} {dest.name}, {dest.country}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            {preferences.dates && (
              <span>Du {preferences.dates.from} au {preferences.dates.to}</span>
            )}
            <span>·</span>
            <span>{preferences.travelers} voyageur{(preferences.travelers || 1) > 1 ? "s" : ""}</span>
          </div>
        </div>
      </motion.div>

      {/* Budget overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-card p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-dark mb-4">Budget total</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <BudgetItem label="Vol A/R" amount={flightCost} emoji="✈️" />
          <BudgetItem label="Hotel" amount={hotelCost} emoji="🏨" />
          <BudgetItem label="Activites" amount={actCost} emoji="🎯" />
          <BudgetItem label="Restaurants" amount={restCost} emoji="🍽️" />
        </div>
        <div className="border-t border-surface-border pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-muted">Total par personne</p>
            <p className="text-3xl font-bold text-dark">{totalPerPerson}€</p>
          </div>
          {(preferences.travelers || 1) > 1 && (
            <div className="text-right">
              <p className="text-sm text-dark-muted">Total pour {preferences.travelers} pers.</p>
              <p className="text-3xl font-bold text-accent">{totalAll}€</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Flight detail */}
      {selectedFlight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-card p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-dark mb-4">✈️ Vol</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-lg font-bold text-dark-light">
                {selectedFlight.airline.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-dark">{selectedFlight.airline}</p>
                <p className="text-sm text-dark-muted">{selectedFlight.departure_time} → {selectedFlight.arrival_time} · {selectedFlight.duration} · {selectedFlight.stops === 0 ? "Direct" : `${selectedFlight.stops} escale`}</p>
              </div>
            </div>
            <p className="text-xl font-bold text-dark">{selectedFlight.price_eur}€</p>
          </div>
        </motion.div>
      )}

      {/* Hotel detail */}
      {selectedHotel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-card p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-dark mb-4">🏨 Hebergement</h2>
          <div className="flex gap-4">
            <img src={selectedHotel.image} alt={selectedHotel.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-dark">{selectedHotel.name}</p>
              <p className="text-sm text-dark-muted">{"★".repeat(selectedHotel.stars)} · Note: {selectedHotel.rating}/10 · {selectedHotel.dist_center} du centre</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedHotel.amenities.map((a) => (
                  <span key={a} className="px-2 py-0.5 bg-surface rounded-md text-xs text-dark-muted">{a}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-dark">{selectedHotel.price_night}€/nuit</p>
              <p className="text-sm text-dark-muted">Total: {selectedHotel.total_price}€</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activities */}
      {selectedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl shadow-card p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-dark mb-4">🎯 Activites ({selectedActivities.length})</h2>
          <div className="space-y-3">
            {selectedActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <div className="flex items-center gap-3">
                  <img src={a.image} alt={a.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-dark text-sm">{a.name}</p>
                    <p className="text-xs text-dark-muted">{a.category} · {a.duration}</p>
                  </div>
                </div>
                <p className="font-bold text-dark">{a.price_eur}€</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Restaurants */}
      {selectedRestaurants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-card p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-dark mb-4">🍽️ Restaurants ({selectedRestaurants.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {selectedRestaurants.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                <img src={r.image} alt={r.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-dark text-sm">{r.name}</p>
                  <p className="text-xs text-dark-muted">{r.cuisine} · ~{r.price_avg}€</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <button
          onClick={() => reset()}
          className="btn-primary flex-1 text-center text-lg py-4 rounded-2xl"
        >
          Planifier un nouveau voyage
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.print();
            }
          }}
          className="flex-1 text-center text-lg py-4 rounded-2xl border-2 border-dark font-semibold text-dark hover:bg-dark hover:text-white transition-colors"
        >
          Exporter en PDF
        </button>
      </motion.div>
    </div>
  );
}

function BudgetItem({ label, amount, emoji }: { label: string; amount: number; emoji: string }) {
  return (
    <div className="p-4 bg-surface rounded-2xl text-center">
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-lg font-bold text-dark">{amount}€</p>
      <p className="text-xs text-dark-muted">{label}</p>
    </div>
  );
}
