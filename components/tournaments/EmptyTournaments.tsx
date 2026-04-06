import { EmptyData } from "@/components/EmptyData";

const icon = (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <path
      d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4h1M17 4h3a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4h-1M7 4h10v7a5 5 0 0 1-10 0V4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function EmptyTournaments() {
  return (
    <EmptyData
      icon={icon}
      title="No Tournaments Found"
      subtitle="You haven't been registered to any tournaments yet."
    />
  );
}
