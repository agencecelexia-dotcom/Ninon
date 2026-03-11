"use client";

import Link from "next/link";
import { useWizardStore } from "@/stores/wizard-store";

const STEPS_LABELS: Record<string, string> = {
  welcome: "Accueil",
  destinations: "Destinations",
  preferences: "Preferences",
  flights: "Vols",
  hotels: "Hotels",
  activities: "Activites",
  restaurants: "Restos",
  summary: "Recapitulatif",
};

const STEP_ORDER = ["welcome", "destinations", "preferences", "flights", "hotels", "activities", "restaurants", "summary"];

export function Header() {
  const { step, reset } = useWizardStore();
  const currentIndex = STEP_ORDER.indexOf(step);
  const progress = step === "welcome" ? 0 : ((currentIndex) / (STEP_ORDER.length - 1)) * 100;

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" onClick={() => reset()} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-dark">SOLEIL</span>
          </Link>

          {/* Step indicator - desktop */}
          {step !== "welcome" && (
            <div className="hidden md:flex items-center gap-1">
              {STEP_ORDER.filter(s => s !== "welcome").map((s, i) => {
                const sIndex = STEP_ORDER.indexOf(s);
                const isActive = sIndex === currentIndex;
                const isDone = sIndex < currentIndex;
                return (
                  <div key={s} className="flex items-center">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive ? "bg-accent text-white" : isDone ? "bg-accent-50 text-accent" : "text-dark-muted"
                    }`}>
                      {isDone && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span>{STEPS_LABELS[s]}</span>
                    </div>
                    {i < STEP_ORDER.length - 2 && (
                      <div className={`w-6 h-px mx-1 ${sIndex < currentIndex ? "bg-accent" : "bg-surface-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile step indicator */}
          {step !== "welcome" && (
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm font-semibold text-dark">{STEPS_LABELS[step]}</span>
              <span className="text-xs text-dark-muted">{currentIndex}/{STEP_ORDER.length - 1}</span>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {step !== "welcome" && (
              <button
                onClick={() => reset()}
                className="text-sm text-dark-muted hover:text-accent transition-colors font-medium"
              >
                Nouveau voyage
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {step !== "welcome" && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </header>
  );
}
