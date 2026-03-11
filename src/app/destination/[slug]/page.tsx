"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/soleil/Header";
import { ScoreRing } from "@/components/soleil/ScoreRing";
import { WeatherBar } from "@/components/soleil/WeatherBar";
import { FlightCard } from "@/components/soleil/FlightCard";
import { HotelCard } from "@/components/soleil/HotelCard";
import { TipBubble } from "@/components/soleil/TipBubble";
import Link from "next/link";

// Demo data for static pages
const DEMO_DATA = {
  destination: { name: "Séville", country: "Espagne", slug: "seville-espagne" },
  scores: { crowd: 38, price: 82, beauty: 91, beach: 45, activities: 88, global: 75 },
  weather: { period: "juin", avg_temp: 32, sun_days: 28, recommendation: "Idéal — temps chaud et ensoleillé, parfait pour les visites" },
  flights: [
    { rank: 1, airline: "Vueling", price_eur: 89, duration: "2h10", stops: 0, badge: "💚 Moins cher", booking_url: "https://www.vueling.com" },
    { rank: 2, airline: "Ryanair", price_eur: 95, duration: "2h05", stops: 0, badge: "⚡ Plus rapide", booking_url: "https://www.ryanair.com" },
    { rank: 3, airline: "easyJet", price_eur: 112, duration: "2h15", stops: 0, badge: "🎯 Meilleur rapport", booking_url: "https://www.easyjet.com" },
  ],
  hotels: [
    { rank: 1, name: "Hotel Cervantes", price_night: 67, rating: 8.7, dist_beach_km: 0, dist_center_km: 0.3, badge: "☀️ Coup de cœur", booking_url: "https://www.booking.com", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
    { rank: 2, name: "Casa del Poeta", price_night: 89, rating: 9.1, dist_beach_km: 1.2, dist_center_km: 0.0, badge: "⭐ Note exceptionnelle", booking_url: "https://www.booking.com", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400" },
  ],
  tips: [
    { id: "tip-1", destination: "seville-espagne", text: "Le quartier de Triana est bien plus authentique que le centre touristique. Les tapas bars sur Calle Betis sont incroyables et moitié prix !", tag: "bon-plan" as const, votes: 47, author_id: "anon-1", created_at: "2026-02-10T10:00:00Z" },
    { id: "tip-2", destination: "seville-espagne", text: "Évitez les calèches sur la Plaza de España — piège à touristes classique. Visitez plutôt à pied tôt le matin.", tag: "piege" as const, votes: 32, author_id: "anon-2", created_at: "2026-02-20T14:00:00Z" },
  ],
};

export default function DestinationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const displayName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />

      {/* Hero */}
      <div className="relative h-64 hero-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">{DEMO_DATA.destination.name || displayName}</h1>
          <p className="text-white/70">{DEMO_DATA.destination.country}</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-soleil-gold hover:bg-soleil-gold-dark text-white rounded-full text-sm font-medium transition-colors"
          >
            Chercher des vols avec Claude
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Scores */}
        <section>
          <h2 className="text-xl font-bold text-soleil-indigo mb-4">Score Destination</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <ScoreRing label="Crowd" value={DEMO_DATA.scores.crowd} invert />
              <ScoreRing label="Prix" value={DEMO_DATA.scores.price} />
              <ScoreRing label="Beauté" value={DEMO_DATA.scores.beauty} />
              <ScoreRing label="Plage" value={DEMO_DATA.scores.beach} />
              <ScoreRing label="Activités" value={DEMO_DATA.scores.activities} />
              <ScoreRing label="Global" value={DEMO_DATA.scores.global} highlight />
            </div>
          </div>
        </section>

        {/* Weather */}
        <section>
          <WeatherBar weather={DEMO_DATA.weather} />
        </section>

        {/* Flights */}
        <section>
          <h2 className="text-xl font-bold text-soleil-indigo mb-4">Meilleurs Vols</h2>
          <div className="space-y-3">
            {DEMO_DATA.flights.map((f, i) => (
              <FlightCard key={i} flight={f} />
            ))}
          </div>
        </section>

        {/* Hotels */}
        <section>
          <h2 className="text-xl font-bold text-soleil-indigo mb-4">Meilleurs Hôtels</h2>
          <div className="space-y-3">
            {DEMO_DATA.hotels.map((h, i) => (
              <HotelCard key={i} hotel={h} />
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xl font-bold text-soleil-indigo mb-4">Tips Communauté</h2>
          <div className="space-y-3">
            {DEMO_DATA.tips.map((tip) => (
              <TipBubble key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
