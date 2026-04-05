import { Fixture } from "@/types/types";
import { Calendar, Clock, MapPin, Swords, Banknote } from "lucide-react";

export function MatchInfoPanel({ fixture }: { fixture: Fixture }) {
  const gameDate = new Date(fixture.date);

  const priceKES = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(fixture.price));

  const items = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Date",
      value: gameDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Time",
      value: `${gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${new Date(gameDate.getTime() + 3_600_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Location",
      value: fixture.location,
    },
    {
      icon: <Swords className="w-4 h-4" />,
      label: "Mode",
      value: fixture.mode,
    },
    {
      icon: <Banknote className="w-4 h-4" />,
      label: "Fee",
      value: `KSH ${priceKES} per player`,
    },
  ];

  return (
    <section>
      <h2
        className="text-lg font-black uppercase tracking-tight text-white mb-5"
      >
        Match Details
      </h2>
      <ul className="space-y-3">
        {items.map(({ icon, label, value }) => (
          <li
            key={label}
            className="flex items-center gap-3 text-slate-300 font-semibold text-sm"
          >
            <span className="text-yellow-400 flex-shrink-0">{icon}</span>
            <span className="text-slate-500 uppercase text-[10px] tracking-widest w-16 flex-shrink-0">
              {label}
            </span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
