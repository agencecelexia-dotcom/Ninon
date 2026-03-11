"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizard-store";

const VIBES = [
  { id: "plage", label: "Plage & Farniente", icon: "🏖️", color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { id: "culture", label: "Culture & Histoire", icon: "🏛️", color: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { id: "aventure", label: "Aventure & Nature", icon: "🏔️", color: "bg-green-50 hover:bg-green-100 border-green-200" },
  { id: "city", label: "City Break", icon: "🌆", color: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
  { id: "gastronomie", label: "Gastronomie", icon: "🍷", color: "bg-red-50 hover:bg-red-100 border-red-200" },
  { id: "romantique", label: "Romantique", icon: "💕", color: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
];

const BUDGETS = [
  { id: "economique" as const, label: "Economique", desc: "< 500€/pers", icon: "💚" },
  { id: "confort" as const, label: "Confort", desc: "500-1200€/pers", icon: "⭐" },
  { id: "premium" as const, label: "Premium", desc: "1200€+/pers", icon: "👑" },
];

export function WelcomeStep() {
  const { setStep, setPreferences, setLoading, setLoadingMessage, setDestinations } = useWizardStore();
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<"economique" | "confort" | "premium">("confort");
  const [travelers, setTravelers] = useState(2);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const canProceed = selectedVibe && selectedBudget && dateFrom && dateTo;

  const handleSearch = async () => {
    if (!canProceed) return;

    setPreferences({
      budget: selectedBudget,
      travelers,
      vibe: selectedVibe,
      dates: { from: dateFrom, to: dateTo },
      interests: [selectedVibe],
    });

    setLoading(true);
    setLoadingMessage("SOLEIL cherche les meilleures destinations pour toi...");
    setStep("destinations");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_destinations",
          vibe: selectedVibe,
          budget: selectedBudget,
          travelers,
          dates: { from: dateFrom, to: dateTo },
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

      // Try to extract JSON destinations from response
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch?.[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.destinations) {
          setDestinations(parsed.destinations);
        }
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }

    // If API failed or no results, use fallback data
    const store = useWizardStore.getState();
    if (store.destinations.length === 0) {
      setDestinations(FALLBACK_DESTINATIONS);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <div className="hero-gradient text-white py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold mb-4 leading-tight"
          >
            Ton prochain voyage,<br />
            <span className="text-gradient">sur mesure.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto"
          >
            SOLEIL planifie ton voyage de A a Z. Destinations, vols, hotels, restos, activites — tout en quelques clics.
          </motion.p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 -mt-8 relative z-10 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-card p-6 sm:p-10 space-y-8"
          >
            {/* Vibe Selection */}
            <div>
              <h2 className="text-lg font-bold text-dark mb-1">Quel style de voyage ?</h2>
              <p className="text-sm text-dark-muted mb-4">Choisis l&apos;ambiance qui te correspond</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {VIBES.map((vibe) => (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedVibe === vibe.id
                        ? "border-accent bg-accent-50 shadow-sm"
                        : `${vibe.color} border-transparent`
                    }`}
                  >
                    <span className="text-2xl">{vibe.icon}</span>
                    <span className="text-sm font-semibold text-dark">{vibe.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-lg font-bold text-dark mb-1">Quand ?</h2>
              <p className="text-sm text-dark-muted mb-4">Selectionne tes dates de voyage</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-muted mb-1.5 uppercase tracking-wide">Depart</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-border focus:border-accent focus:outline-none transition-colors text-dark font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-muted mb-1.5 uppercase tracking-wide">Retour</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-border focus:border-accent focus:outline-none transition-colors text-dark font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h2 className="text-lg font-bold text-dark mb-1">Budget</h2>
              <p className="text-sm text-dark-muted mb-4">Par personne, tout compris</p>
              <div className="grid grid-cols-3 gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBudget(b.id)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      selectedBudget === b.id
                        ? "border-accent bg-accent-50"
                        : "border-surface-border hover:border-dark-muted"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{b.icon}</span>
                    <span className="text-sm font-bold text-dark block">{b.label}</span>
                    <span className="text-xs text-dark-muted">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <h2 className="text-lg font-bold text-dark mb-4">Voyageurs</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-10 h-10 rounded-full border-2 border-surface-border flex items-center justify-center text-lg font-bold text-dark hover:border-accent transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-dark w-8 text-center">{travelers}</span>
                <button
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="w-10 h-10 rounded-full border-2 border-surface-border flex items-center justify-center text-lg font-bold text-dark hover:border-accent transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-dark-muted">
                  {travelers === 1 ? "voyageur" : "voyageurs"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleSearch}
              disabled={!canProceed}
              className="btn-primary w-full text-center text-lg py-4 rounded-2xl"
            >
              Trouver mon voyage parfait
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const FALLBACK_DESTINATIONS = [
  {
    name: "Kotor",
    country: "Montenegro",
    emoji: "🏔️",
    image: "https://images.unsplash.com/photo-1555990538-1e6c89d0b68a?w=800",
    tagline: "Le fjord secret des Balkans",
    price_from: 380,
    temp_avg: 28,
    crowd_level: "low" as const,
    highlights: ["Vieille ville UNESCO", "Bouches de Kotor", "Plages isolees", "Cuisine locale"],
    score: 92,
  },
  {
    name: "Essaouira",
    country: "Maroc",
    emoji: "🌊",
    image: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800",
    tagline: "La perle de l'Atlantique",
    price_from: 320,
    temp_avg: 25,
    crowd_level: "low" as const,
    highlights: ["Medina bleue", "Surf spots", "Riads authentiques", "Street food"],
    score: 89,
  },
  {
    name: "Milos",
    country: "Grece",
    emoji: "🏖️",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800",
    tagline: "L'ile grecque encore secrete",
    price_from: 450,
    temp_avg: 30,
    crowd_level: "low" as const,
    highlights: ["Plage de Sarakiniko", "Villages de pecheurs", "Catacombes", "Couchers de soleil"],
    score: 95,
  },
  {
    name: "Porto",
    country: "Portugal",
    emoji: "🍷",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
    tagline: "La ville qui a tout",
    price_from: 290,
    temp_avg: 24,
    crowd_level: "medium" as const,
    highlights: ["Caves a vin", "Ribeira", "Livraria Lello", "Pasteis de nata"],
    score: 88,
  },
];
