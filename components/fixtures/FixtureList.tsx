import { FixtureCard } from "./FixtureCard";
import { MatchWithPosition } from "@/data/fixtures";

type Props = {
  fixtures: MatchWithPosition[];
};

export function FixtureList({ fixtures }: Props) {
  const now = new Date();

  const upcoming = fixtures
    .filter((f) => !f.match.completed && new Date(f.match.date) >= now)
    .sort((a, b) => new Date(a.match.date).getTime() - new Date(b.match.date).getTime());

  const past = fixtures
    .filter((f) => f.match.completed || new Date(f.match.date) < now)
    .sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime());

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-lg font-black uppercase tracking-tight text-white">
            Upcoming
          </h2>
          <span className="text-[10px] font-black text-yellow-400 border border-yellow-400/30 bg-yellow-400/5 px-2 py-0.5 rounded-md tracking-widest">
            {upcoming.length}
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        {upcoming.length === 0 ? (
          <p className="text-slate-600 text-sm font-semibold">
            No upcoming fixtures. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((f) => (
              <FixtureCard
                key={f.match.id}
                match={f.match}
                playerPosition={f.playerPosition}
              />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-500">
              Past Fixtures
            </h2>
            <span className="text-[10px] font-black text-slate-600 border border-slate-700/40 bg-slate-800/30 px-2 py-0.5 rounded-md tracking-widest">
              {past.length}
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((f) => (
              <FixtureCard
                key={f.match.id}
                match={f.match}
                playerPosition={f.playerPosition}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}