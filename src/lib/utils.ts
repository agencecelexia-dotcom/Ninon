import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PriceLevel, SoleilResponse } from "@/types/soleil";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriceLevel(price: number, avgPrice: number): PriceLevel {
  if (price < avgPrice * 0.8) return "LOW";
  if (price > avgPrice * 1.2) return "HIGH";
  return "TYPICAL";
}

export function getPriceLevelColor(level: PriceLevel): string {
  switch (level) {
    case "LOW":
      return "text-soleil-emerald bg-emerald-50";
    case "TYPICAL":
      return "text-soleil-sky bg-sky-50";
    case "HIGH":
      return "text-soleil-sunset bg-red-50";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#0EA5E9";
  return "#EF4444";
}

export function generateSlug(name: string, country: string): string {
  return `${name}-${country}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseSoleilResponse(text: string): SoleilResponse | null {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]) as SoleilResponse;
    }
    // Try parsing the entire text as JSON
    if (text.trim().startsWith("{")) {
      return JSON.parse(text) as SoleilResponse;
    }
    return null;
  } catch {
    return null;
  }
}

export function extractTextContent(text: string): string {
  return text.replace(/```json\s*[\s\S]*?\s*```/g, "").trim();
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateAnonymousId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("soleil-anonymous-id");
  if (!id) {
    id = `anon-${crypto.randomUUID()}`;
    localStorage.setItem("soleil-anonymous-id", id);
  }
  return id;
}
