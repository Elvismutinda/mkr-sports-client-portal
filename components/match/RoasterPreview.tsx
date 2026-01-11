import { Player } from "@/types/types";
import Image from "next/image";

interface Props {
  players: Player[];
  maxPlayers: number;
}

const RoasterPreview = ({ players, maxPlayers }: Props) => {
  return (
    <div className="pt-8 border-t border-white/5">
      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
        Confirmed Players ({players.length}/{maxPlayers})
      </h4>
      <div className="flex -space-x-3 overflow-hidden">
        {players.slice(0, 8).map((player) => (
          <div key={player.id} className="relative group/player">
            {/* Custom Tactical Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-mkr-navy border border-mkr-yellow rounded-lg opacity-0 scale-95 group-hover/player:opacity-100 group-hover/player:scale-100 transition-all duration-200 pointer-events-none z-60 whitespace-nowrap shadow-2xl">
              <div className="text-[9px] font-black text-mkr-yellow uppercase tracking-widest italic">
                Name
              </div>
              <div className="text-[11px] font-black text-white uppercase italic tracking-tight">
                {player.name}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-mkr-navy border-r border-b border-mkr-yellow rotate-45 -mt-1"></div>
            </div>
            
            <Image
              key={player.id}
              src={player.avatarUrl}
              alt={player.name}
              width={40}
              height={40}
              className="inline-block h-10 w-10 rounded-full ring-4 ring-mkr-dark grayscale hover:grayscale-0 transition-all border border-white/10"
            />
          </div>
        ))}

        {players.length > 8 && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-mkr-dark bg-mkr-slate text-white text-[10px] font-black border border-white/10">
            +{players.length - 8}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoasterPreview;
