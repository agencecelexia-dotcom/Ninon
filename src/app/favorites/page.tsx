"use client";

import { useEffect } from "react";
import { Header } from "@/components/soleil/Header";
import { useFavoritesStore } from "@/stores/favorites-store";
import { FlightCard } from "@/components/soleil/FlightCard";
import { HotelCard } from "@/components/soleil/HotelCard";
import type { Flight, Hotel } from "@/types/soleil";

export default function FavoritesPage() {
  const { favorites, loadFromStorage } = useFavoritesStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const flightFavorites = favorites.filter((f) => f.type === "flight");
  const hotelFavorites = favorites.filter((f) => f.type === "hotel");

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-soleil-indigo mb-2">
          Mes Favoris
        </h1>
        <p className="text-soleil-gray mb-6">
          Tes vols et hôtels sauvegardés.
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">❤️</div>
            <p className="text-soleil-gray">
              Pas encore de favoris. Cherche des vols et hôtels sur le{" "}
              <a href="/" className="text-soleil-gold font-medium hover:underline">
                chat SOLEIL
              </a>{" "}
              et clique sur le cœur !
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {flightFavorites.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-soleil-indigo mb-3">
                  ✈️ Vols ({flightFavorites.length})
                </h2>
                <div className="space-y-3">
                  {flightFavorites.map((fav) => (
                    <FlightCard key={fav.id} flight={fav.data as Flight} />
                  ))}
                </div>
              </section>
            )}

            {hotelFavorites.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-soleil-indigo mb-3">
                  🏨 Hôtels ({hotelFavorites.length})
                </h2>
                <div className="space-y-3">
                  {hotelFavorites.map((fav) => (
                    <HotelCard key={fav.id} hotel={fav.data as Hotel} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
