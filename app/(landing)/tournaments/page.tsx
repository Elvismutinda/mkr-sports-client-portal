"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TournamentGrid from "./(components)/TournamentGrid";
import { DEFAULT_PAGE_SIZE, PaginationMeta, Tournament } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function TournamentsPage() {
  const [query, setQuery] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTournaments = useCallback(async (q: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        q,
        page: String(page),
        limit: String(DEFAULT_PAGE_SIZE),
      });
      const res = await fetch(`/api/tournaments?${params}`);
      if (!res.ok) throw new Error("Failed to load tournaments");
      const json = await res.json();
      setTournaments(json.data ?? []);
      setPagination(json.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTournaments(query, 1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchTournaments]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchTournaments(query, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Active Tournaments
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Explore the latest tournaments, track your favorite teams, and stay
          updated with real-time standings. Join the competition and rise to the
          top!
        </p>

        {/* Search */}
        <div className="flex items-center gap-3 bg-[#0d1117] border border-white/10 rounded-lg px-5 py-3.5 max-w-lg mb-10">
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            className="text-slate-500 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tournaments..."
            className="flex-1 bg-transparent text-sm font-black tracking-widest text-white placeholder:text-slate-600 outline-none"
          />
        </div>

        <div className="mt-4">
          {error ? (
            <div className="py-32 text-center bg-[#0d1117]/60 rounded-lg border border-red-500/20">
              <p className="text-sm font-black uppercase tracking-widest text-red-400">
                Failed to load tournaments
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-600 mt-1">
                {error}
              </p>
            </div>
          ) : (
            <TournamentGrid tournaments={tournaments} loading={loading} />
          )}
        </div>

        {!error && pagination.totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.page - 1)}
                    aria-disabled={pagination.page === 1}
                    className={
                      pagination.page === 1
                        ? "pointer-events-none opacity-30"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === pagination.page}
                        onClick={() => handlePageChange(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(pagination.page + 1)}
                    aria-disabled={pagination.page === pagination.totalPages}
                    className={
                      pagination.page === pagination.totalPages
                        ? "pointer-events-none opacity-30"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600 mt-3">
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} tournaments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}