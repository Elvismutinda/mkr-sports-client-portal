import { Tournament } from "@/types/types";
import { TournamentCard } from "./TournamentCard";

type Props = {
  tournaments: Tournament[];
};

export function TournamentGrid({ tournaments }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
      {tournaments.map((t) => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </section>
  );
}