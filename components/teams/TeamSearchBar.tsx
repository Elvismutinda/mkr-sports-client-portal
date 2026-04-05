"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TeamSearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 bg-[#0d1117] border border-white/10 rounded-2xl px-5 py-3.5 max-w-lg">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-slate-500 shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
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