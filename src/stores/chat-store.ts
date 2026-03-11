"use client";

import { create } from "zustand";
import type { ChatMessage, SoleilResponse } from "@/types/soleil";
import { parseSoleilResponse } from "@/lib/utils";

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  currentStreamText: string;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setCurrentStreamText: (text: string) => void;
  appendStreamText: (chunk: string) => void;
  finalizeStream: () => void;
  clearMessages: () => void;
  getLastResponse: () => SoleilResponse | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  currentStreamText: "",

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (loading) => set({ isLoading: loading }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setCurrentStreamText: (text) => set({ currentStreamText: text }),

  appendStreamText: (chunk) =>
    set((state) => ({ currentStreamText: state.currentStreamText + chunk })),

  finalizeStream: () => {
    const { currentStreamText } = get();
    if (!currentStreamText) return;

    const parsedData = parseSoleilResponse(currentStreamText);
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: currentStreamText,
      parsedData: parsedData || undefined,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, message],
      currentStreamText: "",
      isStreaming: false,
      isLoading: false,
    }));
  },

  clearMessages: () => set({ messages: [], currentStreamText: "" }),

  getLastResponse: () => {
    const { messages } = get();
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].parsedData) {
        return messages[i].parsedData!;
      }
    }
    return null;
  },
}));
