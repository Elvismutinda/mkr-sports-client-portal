"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TeamSearchBar from "@/app/(landing)/teams/(components)/TeamSearchBar";
import TeamGrid from "@/app/(landing)/teams/(components)/TeamGrid";
import { Team } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 8;

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TeamsPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTeams = useCallback(async (q: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        q,
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/teams?${params}`);
      if (!res.ok) throw new Error("Failed to load teams");
      const json = await res.json();
      setTeams(json.data ?? []);
      setPagination(json.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input, reset to page 1
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTeams(query, 1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchTeams]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchTeams(query, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build visible page numbers with ellipsis
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
          Registered Teams
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Analyze and challenge elite teams across the region.
        </p>

        <TeamSearchBar value={query} onChange={setQuery} />

        <div className="mt-10">
          {error ? (
            <div className="py-32 text-center bg-[#0d1117]/60 rounded-lg border border-red-500/20">
              <p className="text-sm font-black uppercase tracking-widest text-red-400">
                Failed to load teams
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-600 mt-1">
                {error}
              </p>
            </div>
          ) : (
            <TeamGrid teams={teams} loading={loading} />
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
              {pagination.total} teams
            </p>
          </div>
        )}
      </div>
    </div>
  );
}