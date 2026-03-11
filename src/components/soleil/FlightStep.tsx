"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";
import type { FlightOption } from "@/types/soleil";

function FlightCard({ flight, selected, onSelect }: { flight: FlightOption; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`cursor-pointer card-hover bg-white rounded-2xl p-5 selection-ring ${selected ? "selected" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-lg font-bold text-dark-light">
            {flight.airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-dark">{flight.airline}</h3>
            <p className="text-xs text-dark-muted">{flight.stops === 0 ? "Direct" : `${flight.stops} escale${flight.stops > 1 ? "s" : ""}`}</p>
          </div>
        </div>
        {flight.badge && <span className="badge badge-accent">{flight.badge}</span>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xl font-bold text-dark">{flight.departure_time}</p>
            <p className="text-xs text-dark-muted">CDG</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-dark-muted mb-1">{flight.duration}</p>
            <div className="w-20 h-px bg-surface-border relative">
              <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-accent" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-dark">{flight.arrival_time}</p>
            <p className="text-xs text-dark-muted">DEST</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-dark">{flight.price_eur}€</p>
          <p className="text-xs text-dark-muted">A/R par pers.</p>
        </div>
      </div>

      {selected && (
        <div className="mt-4 pt-3 border-t border-surface-border flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF385C" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm font-semibold text-accent">Selectionne</span>
        </div>
      )}
    </motion.div>
  );
}

export function FlightStep() {
  const { flights, selectedFlight, selectFlight, setStep, isLoading, loadingMessage, preferences } = useWizardStore();

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
          <p className="text-sm text-dark-muted mt-2">Comparaison des meilleurs vols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-accent">Etape 1</span>
          <span className="text-sm text-dark-muted">sur 4</span>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          Choisis ton vol pour {preferences.destination?.name}
        </h1>
        <p className="text-dark-muted mb-8">
          {flights.length} vols trouves au meilleur prix. Selectionne celui qui te convient.
        </p>
      </motion.div>

      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            selected={selectedFlight?.id === flight.id}
            onSelect={() => selectFlight(flight)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep("destinations")}
          className="text-sm font-semibold text-dark-muted hover:text-dark transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={() => setStep("hotels")}
          disabled={!selectedFlight}
          className="btn-primary px-8"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
