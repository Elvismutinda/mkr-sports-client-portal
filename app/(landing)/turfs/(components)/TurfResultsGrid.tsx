import { Turf } from "@/types/types";
import TurfCard from "./TurfCard";

interface Props {
  turfs: Turf[];
  searched: boolean;
}

export default function TurfResultsGrid({ turfs, searched }: Props) {
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-lg border border-white/5">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-700 mb-5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">
          Location Search Required
        </p>
        <p className="text-xs font-black uppercase tracking-widest text-slate-700 mt-1">
          Initiate search above to locate available turfs.
        </p>
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-lg border border-white/5">
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">
          No turfs found in this location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {turfs.map((turf) => (
        <TurfCard key={turf.id} turf={turf} />
      ))}
    </div>
  );
}