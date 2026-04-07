import { CustomHeader } from "@/components/CustomHeader";
import { TournamentGrid } from "@/components/tournaments/TournamentGrid";
import { EmptyTournaments } from "@/components/tournaments/EmptyTournaments";
import { Tournament } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getTournaments(): Promise<Tournament[]> {
  const res = await fetch(`${BASE_URL}/api/player/tournaments`, { cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to fetch tournaments:", res.statusText);
    return [];
  }
  return res.json();
}

export default async function Page() {
  const tournaments = await getTournaments();
  return (
    <div className="px-6 py-12 md:px-16">
      <CustomHeader
        title="Tournaments"
        subtitle="High-Stake Tournaments and Regional Championships."
      />
      {tournaments.length === 0 ? (
        <EmptyTournaments />
      ) : (
        <TournamentGrid tournaments={tournaments} />
      )}
    </div>
  );
}
