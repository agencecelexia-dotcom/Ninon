"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/soleil/Header";

interface Settings {
  currency: string;
  language: string;
  defaultBudget: number;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  currency: "EUR",
  language: "fr",
  defaultBudget: 800,
  darkMode: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("soleil-settings");
      if (stored) setSettings(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("soleil-settings", JSON.stringify(updated));
    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value as boolean);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream dark:bg-gray-900">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-soleil-indigo dark:text-white mb-6">
          Réglages
        </h1>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-soleil-indigo dark:text-white mb-2">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting("currency", e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-soleil-indigo focus:outline-none focus:ring-2 focus:ring-soleil-gold/50"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF (CHF)</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-soleil-indigo dark:text-white mb-2">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-soleil-indigo focus:outline-none focus:ring-2 focus:ring-soleil-gold/50"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-soleil-indigo dark:text-white mb-2">
              Budget par défaut (€)
            </label>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={settings.defaultBudget}
              onChange={(e) =>
                updateSetting("defaultBudget", parseInt(e.target.value))
              }
              className="w-full accent-soleil-gold"
            />
            <p className="text-center text-lg font-bold text-soleil-gold mt-2">
              {settings.defaultBudget}€
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-soleil-indigo dark:text-white">
                  Mode sombre
                </p>
                <p className="text-xs text-soleil-gray mt-0.5">
                  Active le thème sombre pour un confort visuel en soirée.
                </p>
              </div>
              <button
                onClick={() => updateSetting("darkMode", !settings.darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-soleil-gold" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.darkMode ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-soleil-gray">
          <p>SOLEIL v1.0.0 — Voyage piloté par Claude</p>
          <p>Développé par CELEXIA Digital</p>
        </div>
      </main>
    </div>
  );
}
