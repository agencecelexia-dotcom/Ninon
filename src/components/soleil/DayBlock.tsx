"use client";

import { motion } from "framer-motion";
import type { ItineraryDay } from "@/types/soleil";
import { formatEUR } from "@/lib/utils";

interface DayBlockProps {
  day: ItineraryDay;
}

export function DayBlock({ day }: DayBlockProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.005 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="flex">
        {/* Day number sidebar */}
        <div className="w-16 bg-gradient-to-b from-soleil-gold to-soleil-gold-dark flex flex-col items-center justify-center text-white flex-shrink-0">
          <span className="text-xs font-medium uppercase">Jour</span>
          <span className="text-2xl font-bold">{day.day}</span>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-soleil-indigo">{day.title}</h5>
            <span className="text-sm font-medium text-soleil-gold">
              ~{formatEUR(day.budget_est)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">🌅</span>
              <div>
                <p className="text-xs font-semibold text-soleil-gray uppercase">
                  Matin
                </p>
                <p className="text-sm text-soleil-indigo">{day.morning}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">☀️</span>
              <div>
                <p className="text-xs font-semibold text-soleil-gray uppercase">
                  Après-midi
                </p>
                <p className="text-sm text-soleil-indigo">{day.afternoon}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">🌙</span>
              <div>
                <p className="text-xs font-semibold text-soleil-gray uppercase">
                  Soir
                </p>
                <p className="text-sm text-soleil-indigo">{day.evening}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
