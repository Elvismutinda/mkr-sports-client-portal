"use client";

import { useState, useEffect, useCallback } from "react";
import SectorReconSearch from "@/app/(landing)/turfs/(components)/SectorReconSearch";
import TurfResultsGrid from "@/app/(landing)/turfs/(components)/TurfResultsGrid";
import { DEFAULT_PAGE_SIZE, PaginationMeta, Turf } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function TurfsPage() {
  const [query, setQuery] = useState("");
  const [committed, setCommitted] = useState(""); // only updates on Search click
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTurfs = useCallback(async (q: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        q,
        page: String(page),
        limit: String(DEFAULT_PAGE_SIZE),
      });
      const res = await fetch(`/api/turfs?${params}`);
      if (!res.ok) throw new Error("Failed to load turfs");
      const json = await res.json();
      setTurfs(json.data ?? []);
      setPagination(json.pagination);
      setSearched(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — all turfs, no query
  useEffect(() => {
    fetchTurfs("", 1);
  }, [fetchTurfs]);

  const handleScan = useCallback(() => {
    setCommitted(query);
    fetchTurfs(query, 1);
  }, [query, fetchTurfs]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchTurfs(committed, page);
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
            <TurfResultsGrid turfs={turfs} searched={searched} loading={loading} />
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
              {pagination.total} turfs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}