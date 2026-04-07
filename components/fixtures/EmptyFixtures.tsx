import { EmptyData } from "@/components/EmptyData";
import { CalendarDays } from "lucide-react";

const icon = (
  <CalendarDays className="w-12 h-12 text-slate-500" />
);

export function EmptyFixtures() {
  return (
    <EmptyData
      icon={icon}
      title="No Fixtures Found"
      subtitle="You haven't been registered to any matches yet."
    />
  );
}
