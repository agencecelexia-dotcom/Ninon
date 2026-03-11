"use client";

import { useEffect } from "react";
import { Header } from "@/components/soleil/Header";
import { SoleilChat } from "@/components/soleil/SoleilChat";
import { useHistoryStore } from "@/stores/history-store";
import { useFavoritesStore } from "@/stores/favorites-store";

export default function Home() {
  const { loadFromStorage: loadHistory } = useHistoryStore();
  const { loadFromStorage: loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadHistory();
    loadFavorites();
  }, [loadHistory, loadFavorites]);

  return (
    <div className="flex flex-col h-screen bg-soleil-cream">
      <Header />
      <main className="flex-1 overflow-hidden">
        <SoleilChat />
      </main>
    </div>
  );
}
