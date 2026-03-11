"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/soleil/Header";
import { TipBubble } from "@/components/soleil/TipBubble";
import type { Tip, TipTag } from "@/types/soleil";
import { TIP_TAG_LABELS } from "@/types/soleil";
import { generateAnonymousId } from "@/lib/utils";

export default function TipsPage() {
  const params = useParams();
  const destination = params.destination as string;
  const [tips, setTips] = useState<Tip[]>([]);
  const [newTipText, setNewTipText] = useState("");
  const [newTipTag, setNewTipTag] = useState<TipTag>("bon-plan");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = destination
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  useEffect(() => {
    fetch(`/api/tips?destination=${destination}`)
      .then((r) => r.json())
      .then((data) => setTips(data.tips || []))
      .catch(() => {});
  }, [destination]);

  const submitTip = async () => {
    if (!newTipText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          text: newTipText.trim(),
          tag: newTipTag,
          author_id: generateAnonymousId(),
        }),
      });
      const data = await res.json();
      if (data.tip) {
        setTips((prev) => [data.tip, ...prev]);
        setNewTipText("");
      }
    } catch {
      // ignore
    }
    setIsSubmitting(false);
  };

  const handleVote = async (tipId: string, vote: "up" | "down") => {
    await fetch("/api/tips", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tip_id: tipId, destination, vote }),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-soleil-cream">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-soleil-indigo mb-2">
          Tips — {displayName}
        </h1>
        <p className="text-soleil-gray mb-6">
          Conseils de la communauté SOLEIL pour {displayName}.
        </p>

        {/* New tip form */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-soleil-indigo mb-3">
            Partager un conseil
          </h3>
          <textarea
            value={newTipText}
            onChange={(e) => setNewTipText(e.target.value)}
            placeholder="Un bon plan, un piège à éviter, un endroit caché..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-soleil-indigo placeholder:text-soleil-gray/50 focus:outline-none focus:ring-2 focus:ring-soleil-gold/50 mb-3"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(Object.keys(TIP_TAG_LABELS) as TipTag[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setNewTipTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    newTipTag === tag
                      ? "bg-soleil-gold text-white"
                      : "bg-gray-100 text-soleil-gray hover:bg-gray-200"
                  }`}
                >
                  {TIP_TAG_LABELS[tag].emoji} {TIP_TAG_LABELS[tag].label}
                </button>
              ))}
            </div>
            <button
              onClick={submitTip}
              disabled={!newTipText.trim() || isSubmitting}
              className="px-4 py-2 bg-soleil-gold hover:bg-soleil-gold-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Publier"}
            </button>
          </div>
        </div>

        {/* Tips list */}
        {tips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-soleil-gray">
              Aucun tip pour cette destination. Sois le premier !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <TipBubble key={tip.id} tip={tip} onVote={handleVote} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
