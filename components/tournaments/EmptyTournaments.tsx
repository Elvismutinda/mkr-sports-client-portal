import { EmptyData } from "@/components/EmptyData";
import { Trophy } from "lucide-react";

const icon = (
  <Trophy className="w-12 h-12 text-slate-500" />
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
