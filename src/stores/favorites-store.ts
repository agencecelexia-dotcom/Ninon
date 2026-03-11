"use client";

import { create } from "zustand";
import type { FavoriteItem } from "@/types/soleil";

interface FavoritesStore {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  loadFromStorage: () => void;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  addFavorite: (item) => {
    set((state) => {
      const updated = [...state.favorites, item];
      if (typeof window !== "undefined") {
        localStorage.setItem("soleil-favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    });
  },

  removeFavorite: (id) => {
    set((state) => {
      const updated = state.favorites.filter((f) => f.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("soleil-favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    });
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("soleil-favorites");
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch {
      // Ignore parse errors
    }
  },
}));
