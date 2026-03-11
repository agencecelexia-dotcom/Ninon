"use client";

import { Header } from "@/components/soleil/Header";
import { ScoreRing } from "@/components/soleil/ScoreRing";

const COMPARE_DATA = [
  {
    name: "Séville",
    country: "Espagne",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400",
    scores: { crowd: 38, price: 82, beauty: 91, beach: 45, activities: 88, global: 75 },
    flight_from: 89,
    hotel_from: 42,
    weather: "32°C, 28j soleil",
  },
  {
    name: "Porto",
    country: "Portugal",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400",
    scores: { crowd: 52, price: 75, beauty: 88, beach: 55, activities: 82, global: 74 },
    flight_from: 75,
    hotel_from: 55,
    weather: "25°C, 22j soleil",
  },
];

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-soleil-indigo mb-2">
          Comparatif
        </h1>
        <p className="text-soleil-gray mb-6">
          Compare deux destinations côte à côte. Utilise le chat SOLEIL pour comparer tes propres destinations.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {COMPARE_DATA.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-soleil-indigo">
                  {dest.name}
                </h3>
                <p className="text-sm text-soleil-gray mb-4">{dest.country}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <ScoreRing label="Global" value={dest.scores.global} highlight />
                  <ScoreRing label="Crowd" value={dest.scores.crowd} invert />
                  <ScoreRing label="Prix" value={dest.scores.price} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-soleil-gray">Vol dès</span>
                    <span className="font-bold text-soleil-indigo">
                      {dest.flight_from}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soleil-gray">Hôtel dès</span>
                    <span className="font-bold text-soleil-indigo">
                      {dest.hotel_from}€/nuit
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soleil-gray">Météo</span>
                    <span className="font-bold text-soleil-indigo">
                      {dest.weather}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-soleil-gold hover:bg-soleil-gold-dark text-white rounded-full font-medium transition-colors"
          >
            Comparer d&apos;autres destinations avec Claude
          </a>
        </div>
      </main>
    </div>
  );
}
