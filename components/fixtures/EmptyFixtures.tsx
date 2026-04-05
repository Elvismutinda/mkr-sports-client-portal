export function EmptyFixtures() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        className="text-slate-700 mb-5"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
        No Fixtures Found
      </p>
      <p className="text-slate-700 text-xs font-medium mt-1">
        You haven&apos;t been registered to any matches yet.
      </p>
    </div>
  );
}