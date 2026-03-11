"use client";

import { create } from "zustand";
import type { SearchHistoryItem } from "@/types/soleil";

const MAX_HISTORY = 20;

interface HistoryStore {
  history: SearchHistoryItem[];
  addSearch: (query: string, destination?: string) => void;
  clearHistory: () => void;
  loadFromStorage: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],

  addSearch: (query, destination) => {
    set((state) => {
      const item: SearchHistoryItem = {
        id: crypto.randomUUID(),
        query,
        destination,
        timestamp: Date.now(),
      };
      const updated = [item, ...state.history].slice(0, MAX_HISTORY);
      if (typeof window !== "undefined") {
        localStorage.setItem("soleil-history", JSON.stringify(updated));
      }
      return { history: updated };
    });
  },

  clearHistory: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("soleil-history");
    }
    set({ history: [] });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("soleil-history");
      if (stored) {
        set({ history: JSON.parse(stored) });
      }
    } catch {
      // Ignore parse errors
    }
  },
}));
