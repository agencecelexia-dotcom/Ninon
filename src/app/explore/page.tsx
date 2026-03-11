"use client";

import { useState } from "react";
import { Header } from "@/components/soleil/Header";
import { ScoreRing } from "@/components/soleil/ScoreRing";
import Link from "next/link";

const TRENDING_DESTINATIONS = [
  {
    name: "Séville",
    country: "Espagne",
    slug: "seville-espagne",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600",
    scores: { crowd: 38, price: 82, beauty: 91, beach: 45, activities: 88, global: 75 },
    tag: "Off-track",
  },
  {
    name: "Kotor",
    country: "Monténégro",
    slug: "kotor-montenegro",
    image: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600",
    scores: { crowd: 22, price: 90, beauty: 95, beach: 70, activities: 65, global: 82 },
    tag: "Off-track",
  },
  {
    name: "Matera",
    country: "Italie",
    slug: "matera-italie",
    image: "https://images.unsplash.com/photo-1568797629557-c8f0a355e47b?w=600",
    scores: { crowd: 28, price: 78, beauty: 96, beach: 30, activities: 72, global: 78 },
    tag: "Off-track",
  },
  {
    name: "Porto",
    country: "Portugal",
    slug: "porto-portugal",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600",
    scores: { crowd: 52, price: 75, beauty: 88, beach: 55, activities: 82, global: 74 },
    tag: "Populaire",
  },
  {
    name: "Ghent",
    country: "Belgique",
    slug: "ghent-belgique",
    image: "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=600",
    scores: { crowd: 25, price: 65, beauty: 85, beach: 0, activities: 78, global: 70 },
    tag: "Off-track",
  },
  {
    name: "Valletta",
    country: "Malte",
    slug: "valletta-malte",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600",
    scores: { crowd: 35, price: 70, beauty: 90, beach: 80, activities: 68, global: 76 },
    tag: "Off-track",
  },
];

export default function ExplorePage() {
  const [filter, setFilter] = useState<"all" | "off-track" | "beach" | "culture">("all");

  const filtered = TRENDING_DESTINATIONS.filter((d) => {
    if (filter === "off-track") return d.scores.crowd < 40;
    if (filter === "beach") return d.scores.beach > 50;
    if (filter === "culture") return d.scores.activities > 75;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-soleil-indigo mb-2">
          Explorer les destinations
        </h1>
        <p className="text-soleil-gray mb-6">
          Découvre des destinations incroyables, triées par nos scores IA.
        </p>

        <div className="flex gap-2 mb-8">
          {(["all", "off-track", "beach", "culture"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-soleil-gold text-white"
                  : "bg-white text-soleil-gray hover:bg-soleil-cream-dark"
              }`}
            >
              {f === "all" && "Toutes"}
              {f === "off-track" && "🔍 Off-track"}
              {f === "beach" && "🏖️ Plage"}
              {f === "culture" && "🏛️ Culture"}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <Link key={dest.slug} href={`/destination/${dest.slug}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        dest.tag === "Off-track"
                          ? "bg-soleil-emerald text-white"
                          : "bg-soleil-sky text-white"
                      }`}
                    >
                      {dest.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-soleil-indigo">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-soleil-gray mb-3">{dest.country}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <ScoreRing label="Global" value={dest.scores.global} />
                      <ScoreRing label="Crowd" value={dest.scores.crowd} invert />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
