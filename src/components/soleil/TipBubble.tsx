"use client";

import { useState } from "react";
import type { Tip } from "@/types/soleil";
import { TIP_TAG_LABELS } from "@/types/soleil";

interface TipBubbleProps {
  tip: Tip;
  onVote?: (tipId: string, vote: "up" | "down") => void;
}

export function TipBubble({ tip, onVote }: TipBubbleProps) {
  const [votes, setVotes] = useState(tip.votes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const tagInfo = TIP_TAG_LABELS[tip.tag];

  const handleVote = (direction: "up" | "down") => {
    if (voted === direction) return;
    const delta = direction === "up" ? 1 : -1;
    const revert = voted ? (voted === "up" ? -1 : 1) : 0;
    setVotes((v) => v + delta + revert);
    setVoted(direction);
    onVote?.(tip.id, direction);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote("up")}
            className={`p-1 rounded transition-colors ${
              voted === "up"
                ? "text-soleil-emerald bg-emerald-50"
                : "text-soleil-gray hover:text-soleil-emerald"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-sm font-bold text-soleil-indigo">{votes}</span>
          <button
            onClick={() => handleVote("down")}
            className={`p-1 rounded transition-colors ${
              voted === "down"
                ? "text-soleil-sunset bg-red-50"
                : "text-soleil-gray hover:text-soleil-sunset"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-soleil-cream text-soleil-indigo">
              {tagInfo.emoji} {tagInfo.label}
            </span>
            <span className="text-[10px] text-soleil-gray">
              {new Date(tip.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <p className="text-sm text-soleil-indigo">{tip.text}</p>
        </div>
      </div>
    </div>
  );
}
