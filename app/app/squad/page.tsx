import { CustomHeader } from "@/components/CustomHeader";
import { EmptyRoster } from "@/components/roster/EmptyRoster";
import { PlayerGrid } from "@/components/roster/PlayerGrid";
import { Player } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${BASE_URL}/api/player/roster`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SquadPage() {
  const players = await getPlayers();

  return (
    <div className="px-6 py-12 md:px-16">
      <CustomHeader
        title="Team Members"
        subtitle="Your team, roster, and player profiles"
        activeCount={players.length}
      />
      {players.length === 0 ? (
        <EmptyRoster />
      ) : (
        <PlayerGrid players={players} />
      )}
    </div>
  );
}
