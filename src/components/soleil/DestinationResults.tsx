"use client";

import { motion } from "framer-motion";
import type { SoleilResponse } from "@/types/soleil";
import { FlightCard } from "./FlightCard";
import { HotelCard } from "./HotelCard";
import { ScoreRing } from "./ScoreRing";
import { WeatherBar } from "./WeatherBar";
import { DayBlock } from "./DayBlock";

interface DestinationResultsProps {
  data: SoleilResponse;
  textContent: string;
}

export function DestinationResults({ data, textContent }: DestinationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Claude's text response */}
      {textContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 text-soleil-indigo whitespace-pre-wrap"
        >
          {textContent}
        </motion.div>
      )}

      {/* Destination Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-soleil-gold/10 to-soleil-sky/10 rounded-2xl p-6 border border-soleil-gold/20"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📍</span>
          <div>
            <h3 className="text-2xl font-bold text-soleil-indigo">
              {data.destination.name}
            </h3>
            <p className="text-soleil-gray">{data.destination.country}</p>
          </div>
        </div>
        {data.off_track_note && (
          <p className="text-sm text-soleil-gray mt-2 italic">
            💡 {data.off_track_note}
          </p>
        )}
      </motion.div>

      {/* Scores */}
      {data.scores && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-bold text-soleil-indigo mb-3">
            📊 Score Destination
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <ScoreRing label="Crowd" value={data.scores.crowd} invert />
            <ScoreRing label="Prix" value={data.scores.price} />
            <ScoreRing label="Beauté" value={data.scores.beauty} />
            <ScoreRing label="Plage" value={data.scores.beach} />
            <ScoreRing label="Activités" value={data.scores.activities} />
            <ScoreRing label="Global" value={data.scores.global} highlight />
          </div>
        </motion.div>
      )}

      {/* Weather */}
      {data.weather && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeatherBar weather={data.weather} />
        </motion.div>
      )}

      {/* Flights */}
      {data.flights && data.flights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-lg font-bold text-soleil-indigo mb-3">
            ✈️ Meilleurs Vols
          </h4>
          <div className="space-y-3">
            {data.flights.map((flight, i) => (
              <FlightCard key={i} flight={flight} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Hotels */}
      {data.hotels && data.hotels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-lg font-bold text-soleil-indigo mb-3">
            🏨 Meilleurs Hôtels
          </h4>
          <div className="space-y-3">
            {data.hotels.map((hotel, i) => (
              <HotelCard key={i} hotel={hotel} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Itinerary */}
      {data.itinerary && data.itinerary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-lg font-bold text-soleil-indigo mb-3">
            📅 Itinéraire Jour par Jour
          </h4>
          <div className="space-y-3">
            {data.itinerary.map((day, i) => (
              <DayBlock key={i} day={day} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
