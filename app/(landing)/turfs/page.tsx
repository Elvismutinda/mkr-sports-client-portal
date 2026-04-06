"use client";

import { useState, useEffect, useCallback } from "react";
import SectorReconSearch from "@/app/(landing)/turfs/(components)/SectorReconSearch";
import TurfResultsGrid from "@/app/(landing)/turfs/(components)/TurfResultsGrid";
import { Turf } from "@/types/types";

export default function TurfsPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [allTurfs, setAllTurfs] = useState<Turf[]>([]);
  const [results, setResults] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/turfs");
        if (!res.ok) throw new Error("Failed to load turfs");
        const json = await res.json();
        setAllTurfs(json.data ?? []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  const handleScan = useCallback(() => {
    setSearched(true);
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(allTurfs);
      return;
    }
    setResults(
      allTurfs.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.area?.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.amenities?.some((a: string) => a.toLowerCase().includes(q)),
      ),
    );
  }, [query, allTurfs]);

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          Available Turfs
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Real-time grounded search on Kenyan pitches and training facilities.
        </p>

        <SectorReconSearch
          value={query}
          onChange={setQuery}
          onScan={handleScan}
          loading={loading}
        />

        <div className="mt-8">
          {error ? (
            <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-lg border border-red-500/20">
              <p className="text-sm font-black uppercase tracking-widest text-red-400">
                Failed to load turfs
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-600 mt-1">
                {error}
              </p>
            </div>
          ) : (
            <TurfResultsGrid
              turfs={results}
              searched={searched}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}