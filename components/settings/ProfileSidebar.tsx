'use client';

import React from 'react';
import { Player, Position } from '@/types/types';
import { User } from 'next-auth';

interface Props {
  user: User & {
    role: 'player' | 'agent';
    phone: string;
    position: Position;
    stats?: Player['stats'];
  };
}

function getInitials(name?: string | null): string {
  if (!name) return '??';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export const ProfileSidebar: React.FC<Props> = ({ user }) => {
  const initials = getInitials(user.name);

  return (
    <div className="lg:w-1/3 shrink-0">
      <div className="sticky top-8 space-y-6">
        <div className="bg-mkr-dark border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full border-4 border-mkr-yellow/20 shadow-2xl bg-mkr-navy flex items-center justify-center">
              <span className="text-4xl font-black text-mkr-yellow tracking-tighter select-none">
                {initials}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-mkr-yellow rounded-full border-4 border-mkr-dark flex items-center justify-center">
              <div className="w-2 h-2 bg-mkr-navy rounded-full animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {user.name}
          </h2>
          <p className="text-slate-500 font-bold text-xs mb-4">{user.email}</p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              Elite Member
            </span>
          </div>

          <div className="w-full grid grid-cols-3 gap-2">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">
                {user.stats?.matchesPlayed ?? 0}
              </div>
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                Games
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-mkr-yellow">
                {user.stats?.goals ?? 0}
              </div>
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                Goals
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">
                {user.stats?.rating ?? 0}
              </div>
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                Grade
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};