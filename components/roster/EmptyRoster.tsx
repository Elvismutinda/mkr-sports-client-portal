export function EmptyRoster() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        className="text-slate-700 mb-5"
      >
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
        No Personnel Enlisted
      </p>
      <p className="text-slate-700 text-xs font-medium mt-1">
        Recruit players to populate the roster.
      </p>
    </div>
  );
}
