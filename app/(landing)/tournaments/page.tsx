import TournamentGrid from "./(components)/TournamentGrid";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getTournaments() {
  try {
    const res = await fetch(`${BASE_URL}/api/tournaments`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Active Tournaments
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Explore the latest tournaments, track your favorite teams, and stay
          updated with real-time standings. Join the competition and rise to the
          top!
        </p>
        <TournamentGrid tournaments={tournaments} />
      </div>
    </div>
  );
}
