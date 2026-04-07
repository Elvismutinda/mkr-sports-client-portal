"use client";

import { Zap } from "lucide-react";

export function ActionFab() {
  return (
    <button
      onClick={() => {
        /* wire up your action here */
      }}
      className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-2xl shadow-yellow-400/30 hover:scale-110 hover:brightness-110 transition-all duration-200"
      aria-label="Quick action"
    >
      <Zap className="w-6 h-6" />
    </button>
  );
}
