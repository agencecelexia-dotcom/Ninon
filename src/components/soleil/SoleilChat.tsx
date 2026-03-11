"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/stores/chat-store";
import { useHistoryStore } from "@/stores/history-store";
import { extractTextContent, parseSoleilResponse } from "@/lib/utils";
import { DestinationResults } from "./DestinationResults";

const QUICK_SUGGESTIONS = [
  { label: "✨ Surprise !", prompt: "Surprends-moi avec 3 destinations off-track pour 5 jours en juin depuis Paris, budget max 800€" },
  { label: "💰 Moins de 500€", prompt: "Trouve-moi un voyage de 5 jours pour moins de 500€ depuis Paris, peu importe la destination" },
  { label: "🔍 Off-track", prompt: "Je veux partir loin des touristes, 7 jours, budget flexible. Surprends-moi avec des destinations que personne ne connaît" },
  { label: "🏖️ Plage + culture", prompt: "Je cherche une destination qui mélange plage et culture, 5 jours depuis Paris en été" },
];

export function SoleilChat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    messages,
    isLoading,
    isStreaming,
    currentStreamText,
    addMessage,
    setLoading,
    setStreaming,
    appendStreamText,
    setCurrentStreamText,
    finalizeStream,
  } = useChatStore();
  const { addSearch } = useHistoryStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStreamText]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: text.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    addSearch(text.trim());
    setInput("");
    setLoading(true);
    setStreaming(true);
    setCurrentStreamText("");

    try {
      const allMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody.error) errorDetail = errBody.error;
        } catch {
          // not JSON
        }
        throw new Error(errorDetail);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") {
                appendStreamText(data.text);
              } else if (data.type === "done") {
                finalizeStream();
              } else if (data.type === "error") {
                appendStreamText(`\n\nErreur: ${data.error}`);
                finalizeStream();
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Ensure stream is finalized even if no "done" event
      if (useChatStore.getState().isStreaming) {
        finalizeStream();
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Erreur inconnue";
      setCurrentStreamText(`Désolé, une erreur est survenue : ${errMsg}. Réessayez !`);
      finalizeStream();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">☀️</div>
            <h2 className="text-2xl font-bold text-soleil-indigo mb-2">
              Bienvenue sur SOLEIL
            </h2>
            <p className="text-soleil-gray max-w-md mx-auto mb-8">
              Dis-moi où tu veux partir, ton budget, tes dates... et je
              m&apos;occupe de tout ! Je trouve les meilleurs vols, hôtels et
              je crée ton itinéraire parfait.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  className="px-4 py-2 bg-soleil-cream hover:bg-soleil-cream-dark border border-soleil-gold/20 rounded-full text-sm font-medium text-soleil-indigo transition-all hover:scale-105 hover:shadow-md"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="max-w-4xl w-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soleil-gold to-soleil-sunset flex items-center justify-center text-white text-sm flex-shrink-0">
                      ☀️
                    </div>
                    <div className="flex-1">
                      {message.parsedData ? (
                        <DestinationResults
                          data={message.parsedData}
                          textContent={extractTextContent(message.content)}
                        />
                      ) : (
                        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 whitespace-pre-wrap text-soleil-indigo">
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-xl">
                  <div className="bg-soleil-indigo text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-sm">
                    {message.content}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming text */}
        {isStreaming && currentStreamText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-4xl w-full">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soleil-gold to-soleil-sunset flex items-center justify-center text-white text-sm flex-shrink-0">
                  ☀️
                </div>
                <div className="flex-1">
                  {parseSoleilResponse(currentStreamText) ? (
                    <DestinationResults
                      data={parseSoleilResponse(currentStreamText)!}
                      textContent={extractTextContent(currentStreamText)}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 whitespace-pre-wrap text-soleil-indigo">
                      {currentStreamText}
                      <span className="inline-block w-2 h-5 bg-soleil-gold ml-1 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isLoading && !currentStreamText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soleil-gold to-soleil-sunset flex items-center justify-center text-white text-sm">
                ☀️
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-soleil-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-soleil-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-soleil-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm text-soleil-gray ml-2">
                    Je cherche les meilleures options...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-soleil-cream/50 hover:bg-soleil-cream border border-soleil-gold/10 rounded-full text-xs font-medium text-soleil-gray transition-all disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Dis-moi où tu veux partir..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-2xl border border-gray-200 px-5 py-3 text-soleil-indigo placeholder:text-soleil-gray/50 focus:outline-none focus:ring-2 focus:ring-soleil-gold/50 focus:border-soleil-gold transition-all disabled:opacity-50"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "48px";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-soleil-gold to-soleil-gold-dark text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
