import { Player } from "@/types/types";
import { PlayerCard } from "./PlayerCard";

type Props = {
  players: Player[];
};

export function PlayerGrid({ players }: Props) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </section>
  );
}
