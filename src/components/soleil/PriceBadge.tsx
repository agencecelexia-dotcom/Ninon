"use client";

import { getPriceLevel, getPriceLevelColor } from "@/lib/utils";
import type { PriceLevel } from "@/types/soleil";

interface PriceBadgeProps {
  price: number;
  avgPrice: number;
  level?: PriceLevel;
}

const LABELS: Record<PriceLevel, string> = {
  LOW: "Bas",
  TYPICAL: "Habituel",
  HIGH: "Élevé",
};

export function PriceBadge({ price, avgPrice, level }: PriceBadgeProps) {
  const priceLevel = level || getPriceLevel(price, avgPrice);
  const colorClass = getPriceLevelColor(priceLevel);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorClass}`}
    >
      {priceLevel === "LOW" && "↓ "}
      {priceLevel === "HIGH" && "↑ "}
      {LABELS[priceLevel]}
    </span>
  );
}
