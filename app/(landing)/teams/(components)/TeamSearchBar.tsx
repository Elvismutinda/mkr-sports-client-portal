"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TeamSearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 bg-[#0d1117] border border-white/10 rounded-lg px-5 py-3.5 max-w-lg">
      <Search className="text-slate-500 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search teams..."
        className="flex-1 bg-transparent text-sm font-black tracking-widest text-white placeholder:text-slate-600 outline-none"
      />
    </div>
  );
}