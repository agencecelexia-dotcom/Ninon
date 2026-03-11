"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  label: string;
  value: number;
  highlight?: boolean;
  invert?: boolean;
}

export function ScoreRing({ label, value, highlight, invert }: ScoreRingProps) {
  const displayValue = invert ? 100 - value : value;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (displayValue / 100) * circumference;
  const color = getScoreColor(displayValue);

  return (
    <div className={`flex flex-col items-center ${highlight ? "scale-110" : ""}`}>
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={
              { "--score-offset": `${offset}` } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-sm font-bold"
            style={{ color }}
          >
            {value}
          </span>
        </div>
      </div>
      <span className="text-xs text-soleil-gray mt-1 font-medium">{label}</span>
      {invert && value < 40 && (
        <span className="text-[10px] text-soleil-emerald font-medium">Off-track</span>
      )}
    </div>
  );
}
