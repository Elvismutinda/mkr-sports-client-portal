"use client";

import { useState } from "react";

interface Props {
  playerId: string;
  playerName: string;
  onRemoved: () => void;
}

export function RemovePlayerButton({ playerId, playerName, onRemoved }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
      if (res.ok) {
        onRemoved();
      }
    } catch {
      // silently fail — UI stays consistent
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          Remove?
        </span>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-400 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-red-400 transition-colors"
      title={`Remove ${playerName}`}
    >
      Remove
    </button>
  );
}
