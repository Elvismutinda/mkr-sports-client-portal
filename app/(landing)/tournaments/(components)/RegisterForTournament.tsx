"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  tournamentId: string;
  userId: string;
}

export default function RegisterForTournament({ tournamentId, userId }: Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!agreed) {
      setError("You must acknowledge the terms to proceed.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Registration failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              agreed
                ? "bg-mkr-yellow border-mkr-yellow"
                : "border-white/20 bg-transparent group-hover:border-white/40"
            }`}
          >
            {agreed && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="#0a0f1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 leading-relaxed">
          I acknowledge the campaign protocol and confirm eligibility to participate.
        </span>
      </label>

      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "w-full h-11 text-xs tracking-widest uppercase font-black disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? "Enlisting..." : "Enlist for Campaign"}
      </button>
    </div>
  );
}