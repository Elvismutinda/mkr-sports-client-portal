import { EmptyData } from "@/components/EmptyData";

const icon = (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
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
);

export function EmptyRoster() {
  return (
    <EmptyData
      icon={icon}
      title="No Team Members Enlisted"
      subtitle="Recruit players to populate the roster."
    />
  );
}
