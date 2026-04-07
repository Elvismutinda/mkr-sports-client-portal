"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onScan: () => void;
  loading?: boolean;
}

export default function SectorReconSearch({
  value,
  onChange,
  onScan,
  loading,
}: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 flex items-center gap-3 bg-[#0d1117] border border-white/10 rounded-lg px-5 py-3.5">
        <Search className="text-slate-500 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && onScan()}
          placeholder="Enter location..."
          disabled={loading}
          className="flex-1 bg-transparent text-sm font-black tracking-widest text-white placeholder:text-slate-600 outline-none disabled:opacity-40"
        />
      </div>
      <Button
        onClick={onScan}
        variant="primary"
        size="md"
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </Button>
    </div>
  );
}