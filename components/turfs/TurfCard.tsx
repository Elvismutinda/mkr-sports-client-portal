import { Turf } from "@/types/types";

interface Props {
  turf: Turf;
}

export default function TurfCard({ turf }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.5rem] p-6 hover:border-mkr-yellow/30 transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f5c842"
            strokeWidth="2.5"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1a1a0a] border border-mkr-yellow/20 rounded-lg px-2.5 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5c842">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[11px] font-black text-mkr-yellow">
            {turf.rating}/5
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-black text-white tracking-tight leading-tight mb-0.5">
          {turf.name}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {turf.area}, {turf.city}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {turf.amenities.map((a) => (
          <span
            key={a}
            className="text-[9px] font-black uppercase tracking-wider text-slate-400 border border-white/10 rounded-md px-2 py-0.5"
          >
            {a}
          </span>
        ))}
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(turf.mapsQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors text-center pt-3 border-t border-white/5"
      >
        View Location
      </a>
    </div>
  );
}