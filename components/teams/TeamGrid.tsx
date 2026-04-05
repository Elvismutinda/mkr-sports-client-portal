import { Team } from "@/types/types";
import TeamCard from "./TeamCard";

interface Props {
  teams: Team[];
}

export default function TeamGrid({ teams }: Props) {
  if (teams.length === 0) {
    return (
      <div className="py-32 text-center bg-[#0d1117]/60 rounded-[2rem] border border-white/5">
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">
          No teams found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}