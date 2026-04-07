"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PositionBadge } from "@/components/roster/PositionBadge";
import { Player, Position } from "@/types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Search, LoaderCircle } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  email: string;
  position: Position | null;
  avatarUrl: string | null;
  stats: Player["stats"];
}

interface Props {
  teamId: string;
  onClose: () => void;
  onInvited: () => void; // triggers roster refetch in parent
}

export function InvitePlayerModal({ teamId, onClose, onInvited }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null); // playerId being invited
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setSearching(true);
      try {
        const res = await fetch(
          `/api/players/search?q=${encodeURIComponent(q)}&teamId=${teamId}`,
        );
        const data = await res.json();
        setResults(data ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    },
    [teamId],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const handleInvite = async (playerId: string) => {
    setInviting(playerId);
    setError(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add player.");
        return;
      }
      setInvited((prev) => new Set(prev).add(playerId));
      onInvited();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setInviting(null);
    }
  };

  // Trap focus / close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-[1.75rem] p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Add Player
            </h2>
            <p className="text-xs font-black tracking-widest text-slate-500 mt-0.5">
              Search by name or email
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="primary"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 bg-mkr-navy border border-white/10 rounded-xl px-4 py-3">
          {searching ? (
            <LoaderCircle className="animate-spin text-slate-500 shrink-0" />
          ) : (
            <Search className="text-slate-500 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="flex-1 bg-transparent text-sm font-black tracking-widest text-white placeholder:text-slate-600 outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {error && (
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 -mt-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {query.length < 2 && (
            <div className="py-10 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                Type at least 2 characters to search
              </p>
            </div>
          )}

          {query.length >= 2 && !searching && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                No players found
              </p>
            </div>
          )}

          {results.map((player) => {
            const isInvited = invited.has(player.id);
            const isLoading = inviting === player.id;
            const initials = player.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={player.id}
                className="flex items-center gap-3 bg-mkr-navy/50 border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0">
                  {player.avatarUrl ? (
                    <Image
                      src={player.avatarUrl}
                      alt={player.name}
                      width={36}
                      height={36}
                      className="w-full h-full rounded-full object-cover grayscale"
                    />
                  ) : (
                    <span className="text-xs font-black text-slate-300">
                      {initials}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white uppercase italic tracking-wide truncate">
                    {player.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PositionBadge position={player.position} />
                    {player.stats?.rating != null && (
                      <span className="text-[9px] font-black text-mkr-yellow">
                        {player.stats.rating}/10
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    !isInvited && !isLoading && handleInvite(player.id)
                  }
                  disabled={isInvited || isLoading}
                  className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                    isInvited
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default"
                      : isLoading
                        ? "border-white/10 bg-white/5 text-slate-500 cursor-not-allowed"
                        : "border-mkr-yellow/30 bg-mkr-yellow/10 text-mkr-yellow hover:bg-mkr-yellow/20 cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin text-slate-500" />
                  ) : isInvited ? (
                    "Added"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
