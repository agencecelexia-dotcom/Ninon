"use client";

import { useEffect } from "react";
import { Header } from "@/components/soleil/Header";
import { useHistoryStore } from "@/stores/history-store";

export default function HistoryPage() {
  const { history, clearHistory, loadFromStorage } = useHistoryStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-soleil-indigo">Historique</h1>
            <p className="text-soleil-gray">Tes 20 dernières recherches.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm text-soleil-sunset hover:bg-red-50 rounded-lg transition-colors"
            >
              Effacer tout
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🕐</div>
            <p className="text-soleil-gray">
              Pas encore de recherches. Commence par discuter avec SOLEIL sur le{" "}
              <a href="/" className="text-soleil-gold font-medium hover:underline">
                chat principal
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-soleil-indigo font-medium">{item.query}</p>
                    {item.destination && (
                      <p className="text-sm text-soleil-gold mt-0.5">
                        → {item.destination}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-soleil-gray ml-4">
                    {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
