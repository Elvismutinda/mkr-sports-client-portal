import { UserPlus, Users } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  onInvite?: () => void;
}

export function EmptyRoster({ onInvite }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-[1.75rem] border-2 border-dashed border-white/10">
      <Users className="w-12 h-12 text-slate-600 mb-4" />
      <p className="text-sm font-black uppercase tracking-widest text-slate-600">
        No Players Yet
      </p>
      <p className="text-xs font-black uppercase tracking-widest text-slate-700 mt-1 mb-6">
        Add your first player to build your roster.
      </p>
      {onInvite && (
        <Button
          onClick={onInvite}
          variant="primary"
        >
          <UserPlus className="w-4 h-4" />
          Add First Player
        </Button>
      )}
    </div>
  );
}
