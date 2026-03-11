"use client";

import type { Weather } from "@/types/soleil";

interface WeatherBarProps {
  weather: Weather;
}

export function WeatherBar({ weather }: WeatherBarProps) {
  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100">
      <h4 className="text-lg font-bold text-soleil-indigo mb-3">
        🌤️ Météo — {weather.period}
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-1">🌡️</div>
          <p className="text-lg font-bold text-soleil-indigo">
            {weather.avg_temp}°C
          </p>
          <p className="text-xs text-soleil-gray">Temp. moyenne</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">☀️</div>
          <p className="text-lg font-bold text-soleil-indigo">
            {weather.sun_days}j
          </p>
          <p className="text-xs text-soleil-gray">Jours de soleil</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">
            {weather.recommendation.toLowerCase().includes("idéal") ? "✅" : "⚠️"}
          </div>
          <p className="text-sm font-bold text-soleil-indigo">
            {weather.recommendation.split("—")[0].trim()}
          </p>
          <p className="text-xs text-soleil-gray">Recommandation</p>
        </div>
      </div>
      {weather.recommendation.includes("—") && (
        <p className="text-sm text-soleil-gray mt-3 italic text-center">
          {weather.recommendation.split("—").slice(1).join("—").trim()}
        </p>
      )}
    </div>
  );
}
