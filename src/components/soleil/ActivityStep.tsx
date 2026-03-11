"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";
import type { ActivityOption } from "@/types/soleil";

function ActivityCard({ activity, selected, onToggle }: { activity: ActivityOption; selected: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onToggle}
      className={`cursor-pointer card-hover bg-white rounded-2xl overflow-hidden selection-ring ${selected ? "selected" : ""}`}
    >
      <div className="relative h-36 overflow-hidden">
        <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-sm">{activity.name}</p>
        </div>
        {activity.badge && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-gold text-[10px]">{activity.badge}</span>
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

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-muted">{activity.category}</span>
            <span className="text-xs text-dark-muted">·</span>
            <span className="text-xs text-dark-muted">{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-xs font-semibold text-dark">{activity.rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-dark mt-1">{activity.price_eur}€ <span className="font-normal text-dark-muted text-xs">/pers</span></p>
      </div>
    </motion.div>
  );
}

export function ActivityStep() {
  const { activities, selectedActivities, toggleActivity, setStep, preferences } = useWizardStore();

  const total = selectedActivities.reduce((s, a) => s + a.price_eur, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-accent">Etape 3</span>
          <span className="text-sm text-dark-muted">sur 4</span>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">
          Que faire a {preferences.destination?.name} ?
        </h1>
        <p className="text-dark-muted mb-8">
          Selectionne les activites qui te tentent (plusieurs choix possibles)
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            selected={selectedActivities.some((a) => a.id === activity.id)}
            onToggle={() => toggleActivity(activity)}
          />
        ))}
      </div>

      {selectedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent-50 rounded-2xl flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-accent">{selectedActivities.length} activite{selectedActivities.length > 1 ? "s" : ""} selectionnee{selectedActivities.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-dark-muted">Budget activites: {total}€/pers</p>
          </div>
        </motion.div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep("hotels")}
          className="text-sm font-semibold text-dark-muted hover:text-dark transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={() => setStep("restaurants")}
          className="btn-primary px-8"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
