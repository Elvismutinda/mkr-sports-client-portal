"use client";

import { Button } from "../../ui/button";
import { Users } from "lucide-react";

interface Props {
  onCaptain: () => void;
  onDismiss: () => void;
}

export function TeamRoleAlert({ onCaptain, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-[1.75rem] p-8 shadow-2xl flex flex-col gap-6">
        <div className="w-14 h-14 rounded-2xl bg-mkr-yellow/10 border border-mkr-yellow/20 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6 text-mkr-yellow" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">
            Join a Team
          </h2>
          <p className="text-xs font-semibold text-slate-400 leading-relaxed">
            Are you registering as a <span className="text-mkr-yellow font-black">team captain</span>, or will you be <span className="text-white font-black">invited</span> to a team by your captain?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onCaptain}
            variant="primary"
          >
            I&apos;m a Captain — Register My Team
          </Button>
          <Button
            onClick={onDismiss}
            variant="secondary"
          >
            I&apos;ll Wait for an Invite
          </Button>
        </div>
      </div>
    </div>
  );
}