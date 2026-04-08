import Image from "next/image";

interface Member {
  id: string;
  name: string;
  position: string | null;
  avatarUrl: string | null;
  jerseyNumber: number | null;
}

interface TeamDetail {
  id: string;
  name: string;
  badgeFallback: string | null;
  badgeUrl: string | null;
  type: string | null;
  bio: string | null;
  stats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    rating: number;
  } | null;
  memberCount: number;
  members: Member[];
}

interface Props {
  team: TeamDetail;
}

export default function TeamChallengeHeader({ team }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7 relative overflow-hidden">
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-2xl font-black text-slate-300">
            {team.badgeFallback ?? "??"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-mkr-yellow mb-1">
            Issuing Challenge To
          </p>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
            {team.name}
          </h1>
          {team.type && (
            <span className="inline-block bg-mkr-yellow/10 border border-mkr-yellow/20 text-mkr-yellow text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {team.type}
            </span>
          )}
          {team.bio && (
            <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed ">
              {team.bio}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-6">
        {[
          { label: "Matches", value: team.stats?.matchesPlayed ?? 0 },
          { label: "Wins", value: team.stats?.wins ?? 0 },
          { label: "Losses", value: team.stats?.losses ?? 0 },
          { label: "Rating", value: team.stats?.rating?.toFixed(1) ?? "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5"
          >
            <div className="text-lg font-black text-white leading-none mb-1">
              {s.value}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {team.members.length > 0 && (
        <div className="mt-5 flex items-center gap-2 pt-5 border-t border-white/5">
          <div className="flex -space-x-2">
            {team.members.slice(0, 6).map((m) => (
              <div
                key={m.id}
                title={m.name}
                className="w-7 h-7 rounded-full bg-mkr-navy border-2 border-[#0d1117] flex items-center justify-center"
              >
                {m.avatarUrl ? (
                  <Image
                    src={m.avatarUrl}
                    alt={m.name}
                    width={28}
                    height={28}
                    className="w-full h-full rounded-full object-cover grayscale"
                  />
                ) : (
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    {m.name[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {team.memberCount} player{team.memberCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
