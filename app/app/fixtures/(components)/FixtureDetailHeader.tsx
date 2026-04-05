import { Fixture } from "@/types/types";
import { FixtureStatusBadge } from "@/components/fixtures/FixtureStatusBadge";
import { PositionBadge } from "@/components/roster/PositionBadge";

type FixtureStatus = "upcoming" | "completed" | "live";

function getStatus(fixture: Fixture): FixtureStatus {
  if (fixture.completed) return "completed";
  const now = new Date();
  const matchDate = new Date(fixture.date);
  const diffMins = (matchDate.getTime() - now.getTime()) / 1000 / 60;
  if (diffMins >= 0 && diffMins <= 90) return "live";
  return "upcoming";
}

export function FixtureDetailHeader({ fixture }: { fixture: Fixture }) {
  const status = getStatus(fixture);
  const gameDate = new Date(fixture.date);

  return (
    <header className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <FixtureStatusBadge status={status} />
        <PositionBadge position={fixture.playerPosition} />
      </div>

      <h1
        className="text-3xl md:text-5xl font-black uppercase text-white leading-none tracking-tight"
      >
        Match Day:{" "}
        <span className="text-yellow-400">
          {gameDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      </h1>
      <p className="mt-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
        {fixture.location} · {fixture.mode}
      </p>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-yellow-400/30 via-white/5 to-transparent" />
    </header>
  );
}