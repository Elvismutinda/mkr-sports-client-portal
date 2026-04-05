// import Image from "next/image";
import { PositionBadge } from "@/components/roster/PositionBadge";
import { FixturePlayer, Position } from "@/types/types";

export function SquadRoster({
  players,
  currentUserId,
}: {
  players: FixturePlayer[];
  currentUserId: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-5">
        <h2 className="text-lg font-black uppercase tracking-tight text-white">
          Squad
        </h2>
        <span className="text-[10px] font-black text-yellow-400 border border-yellow-400/30 bg-yellow-400/5 px-2 py-0.5 rounded-md tracking-widest">
          {players.length}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <ul className="space-y-2">
        {players.map((player) => {
          const isMe = player.id === currentUserId;
          return (
            <li
              key={player.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                isMe
                  ? "border-yellow-400/20 bg-yellow-400/5"
                  : "border-white/5 bg-black/20"
              }`}
            >
              {/* <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
                <Image
                  src={player.avatarUrl ?? "/images/default-avatar.png"}
                  alt={player.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover grayscale"
                />
              </div> */}
              <div
                className={`w-9 h-9 rounded-lg border flex-shrink-0 flex items-center justify-center text-[11px] font-black tracking-wide ${
                  isMe
                    ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                    : "border-white/10 bg-slate-800 text-slate-400"
                }`}
              >
                {player.name
                  .trim()
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <span
                className={`font-black text-sm uppercase flex-1 tracking-tight ${
                  isMe ? "text-yellow-400" : "text-white"
                }`}
              >
                {player.name}
                {isMe && (
                  <span className="ml-2 text-[9px] font-black tracking-widest text-yellow-400/60">
                    YOU
                  </span>
                )}
              </span>
              <PositionBadge position={player.position as Position} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
