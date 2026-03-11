"use client";

import { Header } from "@/components/soleil/Header";
import { DayBlock } from "@/components/soleil/DayBlock";
import type { ItineraryDay } from "@/types/soleil";

const DEMO_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrivée & Triana",
    morning: "Arrivée à l'aéroport, transfert vers l'hôtel. Installation et premier café dans le quartier.",
    afternoon: "Balade dans le quartier de Triana — pont Isabel II, marché de Triana, ruelles colorées.",
    evening: "Tapas sur Calle Betis avec vue sur la rivière Guadalquivir. Churros con chocolate chez un local.",
    budget_est: 45,
  },
  {
    day: 2,
    title: "Centre historique",
    morning: "Visite de la Cathédrale de Séville et montée à la Giralda (arrivez à l'ouverture pour éviter la queue).",
    afternoon: "Real Alcázar — palais et jardins magnifiques. Pause glacée dans le Barrio de Santa Cruz.",
    evening: "Spectacle de flamenco dans un tablao traditionnel à Triana (pas les pièges touristiques du centre).",
    budget_est: 65,
  },
  {
    day: 3,
    title: "Off-track & Local",
    morning: "Marché de la Feria — petit déjeuner local, produits frais. Balade dans le quartier de la Macarena.",
    afternoon: "Parc de María Luisa et Plaza de España (gratuit !). Location de barque sur le canal.",
    evening: "Dîner dans une venta locale hors du centre — cuisine sévillane authentique à moitié prix.",
    budget_est: 35,
  },
  {
    day: 4,
    title: "Excursion nature",
    morning: "Excursion à Italica — ruines romaines impressionnantes à 15 min de Séville (peu touristique).",
    afternoon: "Retour en ville, sieste. Visite du Metropol Parasol (Las Setas) au coucher du soleil.",
    evening: "Dernier soir — bar à tapas crawl dans les rues du centre. Paella et sangria.",
    budget_est: 50,
  },
  {
    day: 5,
    title: "Départ",
    morning: "Petit déjeuner tranquille. Dernière balade le long du Guadalquivir. Shopping souvenirs.",
    afternoon: "Transfert aéroport. Vol retour.",
    evening: "",
    budget_est: 20,
  },
];

export default function ItineraryPage() {
  const totalBudget = DEMO_ITINERARY.reduce((sum, d) => sum + d.budget_est, 0);

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-soleil-indigo">
              Itinéraire Séville
            </h1>
            <p className="text-soleil-gray">
              5 jours • Budget estimé: ~{totalBudget}€
            </p>
          </div>
          <button className="px-4 py-2 bg-soleil-gold hover:bg-soleil-gold-dark text-white rounded-lg text-sm font-medium transition-colors">
            Exporter PDF
          </button>
        </div>

        <div className="space-y-4">
          {DEMO_ITINERARY.map((day) => (
            <DayBlock key={day.day} day={day} />
          ))}
        </div>

        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-soleil-gray text-center">
            Modifie ton itinéraire en discutant avec SOLEIL sur le{" "}
            <a href="/" className="text-soleil-gold font-medium hover:underline">
              chat principal
            </a>
            . Par exemple : &quot;Jour 3 je suis bloqué à l&apos;hôtel, réorganise !&quot;
          </p>
        </div>
      </main>
    </div>
  );
}
