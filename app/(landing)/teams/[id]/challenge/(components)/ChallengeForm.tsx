"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MODES = ["5v5", "7v7", "11v11", "3v3"] as const;

interface Props {
  challengedTeamId: string;
  challengedTeamName: string;
  myTeamName: string;
}

export default function ChallengeForm({
  challengedTeamId,
  challengedTeamName,
  myTeamName,
}: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<string>("5v5");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedLocation, setProposedLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${challengedTeamId}/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          proposedDate: proposedDate || null,
          proposedLocation: proposedLocation || null,
          message: message || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send challenge.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 space-y-5">
        <div className="w-16 h-16 rounded-full bg-mkr-yellow/10 border border-mkr-yellow/20 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-black text-white uppercase tracking-tight">
            Challenge Issued!
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
            {challengedTeamName} will be notified.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push("/teams")}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-xs tracking-widest uppercase font-black",
            )}
          >
            Back to Teams
          </button>
          <button
            onClick={() => router.push("/challenges")}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "text-xs tracking-widest uppercase font-black",
            )}
          >
            View Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-1">
          Challenge Details
        </h2>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          <span className="text-mkr-yellow">{myTeamName}</span> vs{" "}
          <span className="text-mkr-yellow">{challengedTeamName}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Match Format
        </label>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                mode === m
                  ? "bg-mkr-yellow text-mkr-navy border-mkr-yellow"
                  : "bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Proposed Date & Time{" "}
          <span className="text-slate-700">(Optional)</span>
        </label>
        <input
          type="datetime-local"
          value={proposedDate}
          onChange={(e) => setProposedDate(e.target.value)}
          className="w-full bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:border-mkr-yellow/40 transition-colors scheme-dark"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Proposed Location{" "}
          <span className="text-slate-700">(Optional)</span>
        </label>
        <input
          type="text"
          value={proposedLocation}
          onChange={(e) => setProposedLocation(e.target.value)}
          placeholder="e.g. Wembley Elite Hub, Westlands"
          className="w-full bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black tracking-wider text-white placeholder:text-slate-700 outline-none focus:border-mkr-yellow/40 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Message{" "}
          <span className="text-slate-700">(Optional)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message to your challenge..."
          rows={3}
          maxLength={280}
          className="w-full bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-700 outline-none focus:border-mkr-yellow/40 transition-colors resize-none"
        />
        <p className="text-right text-[10px] font-black tracking-widest text-slate-700">
          {message.length}/280
        </p>
      </div>

      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "w-full h-12 text-xs tracking-widest uppercase font-black disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {loading ? "Sending..." : `Challenge ${challengedTeamName}`}
      </button>
    </div>
  );
}