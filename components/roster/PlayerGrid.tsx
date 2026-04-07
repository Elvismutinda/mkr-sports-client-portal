import { Player } from "@/types/types";
import { PlayerCard } from "./PlayerCard";

type Props = {
  players: (Player & { isCaptain: boolean })[];
  onRemove?: (playerId: string) => void;
};

export function PlayerGrid({ players, onRemove }: Props) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onRemove={onRemove ? () => onRemove(player.id) : undefined}
        />
      ))}
    </section>
  );
}
