import { Phone } from "lucide-react";

export function WaitingForInvite() {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-[1.75rem] border-2 border-dashed border-white/10">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Phone className="w-6 h-6 text-white/70" />
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-slate-600">
        Awaiting Invitation
      </p>
      <p className="text-xs font-black uppercase tracking-widest text-slate-700 mt-1 text-center max-w-xs">
        Ask your team captain to add you to their roster. You&apos;ll appear here once added.
      </p>
    </div>
  );
}