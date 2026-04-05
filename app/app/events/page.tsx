import { CustomHeader } from "@/components/CustomHeader";
import { TournamentGrid } from "@/components/tournaments/TournamentGrid";
import { Tournament } from "@/types/types";

// Replace this with your real data source (DB query, API call, etc.)
async function getTournaments(): Promise<Tournament[]> {
  return [
    {
      id: "1",
      name: "MKR ELITE INVITATIONAL",
      location: "MKR SPORTS HQ",
      description:
        "The premier 5-a-side competition for Nairobi's elite amateur squads.",
      prizePool: 50000,
      commencement: "14 Apr",
      status: "UPCOMING",
    },
    {
      id: "2",
      name: "SECTOR 7 CHAMPIONSHIP",
      location: "ARENA COMMAND",
      description:
        "High-intensity bracket tournament currently in the semi-final phase.",
      prizePool: 25000,
      commencement: "2 Apr",
      status: "ONGOING",
    },
    {
      id: "3",
      name: "IRON LEAGUE OPEN",
      location: "WESTLANDS GROUNDS",
      description:
        "Open-entry league format for squads ranked below Elite tier. Season 3 now active.",
      prizePool: 15000,
      commencement: "20 Apr",
      status: "UPCOMING",
    },
    {
      id: "4",
      name: "NAIROBI CUP FINALS",
      location: "KASARANI ARENA",
      description:
        "Annual city-wide knockout cup. Final 8 squads battle for the championship title.",
      prizePool: 80000,
      commencement: "28 Mar",
      status: "COMPLETED",
    },
  ];
}

export default async function Page() {
  const tournaments = await getTournaments();

  return (
    <div className="px-6 py-12 md:px-16">
      <CustomHeader
        title="Tournaments"
        subtitle="High-Stake Tournaments and Regional Championships."
      />

      <TournamentGrid tournaments={tournaments} />
    </div>
  );
}
