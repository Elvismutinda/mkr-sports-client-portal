import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MatchPlayerWithUser } from "@/types/types";

interface Props {
  players: MatchPlayerWithUser[];
  maxPlayers: number;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const RoasterPreview = ({ players, maxPlayers }: Props) => {
  return (
    <div className="pt-8 border-t border-white/5">
      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
        Confirmed Players ({players.length}/{maxPlayers})
      </h4>
      <TooltipProvider delayDuration={100}>
        <div className="flex -space-x-3 overflow-hidden">
          {players.slice(0, 8).map((player) => (
            <Tooltip key={player.id}>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-mkr-dark bg-mkr-slate border border-white/10 cursor-default select-none shrink-0">
                  <span className="text-[11px] font-black text-mkr-yellow uppercase tracking-tight">
                    {getInitials(player.name)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-mkr-navy border border-mkr-yellow rounded-lg px-3 py-1.5 shadow-2xl"
              >
                <div className="text-[9px] font-black text-mkr-yellow uppercase tracking-widest">
                  {player.position}
                </div>
                <div className="text-[11px] font-black text-white uppercase tracking-tight">
                  {player.name}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          {players.length > 8 && (
            <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-mkr-dark bg-mkr-slate text-white text-[10px] font-black border border-white/10 shrink-0">
              +{players.length - 8}
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default RoasterPreview;