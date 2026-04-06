"use client";

import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onScan: () => void;
}

export default function SectorReconSearch({ value, onChange, onScan }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 flex items-center gap-3 bg-[#0d1117] border border-white/10 rounded-lg px-5 py-3.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-slate-500 shrink-0"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onScan()}
          placeholder="Enter location..."
          className="flex-1 bg-transparent text-sm font-black tracking-widest text-white placeholder:text-slate-600 outline-none"
        />
      </div>
      <Button
        onClick={onScan}
        variant={"primary"}
        size={"md"}
      >
        Search
      </Button>
    </div>
  );
}