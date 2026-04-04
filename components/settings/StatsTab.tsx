"use client";

import React from "react";
import { motion } from "framer-motion";
import { Player, Position } from "@/types/types";
import { PlayerRadar } from "@/components/settings/PlayerRadar";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";

interface Props {
  user: User & {
    role: "player" | "agent";
    phone: string;
    position: Position;
    avatarUrl?: string;
    stats?: Player["stats"];
    attributes?: Player["attributes"];
    aiAnalysis?: string;
  };
  analysis?: string;
  onGetAnalysis?: () => void;
}

export const StatsTab: React.FC<Props> = ({
  user,
  analysis,
  onGetAnalysis,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <h4 className="text-[10px] font-black text-mkr-yellow uppercase tracking-widest mb-6">
            Attribute Radar
          </h4>
          <PlayerRadar attributes={user.attributes} />
          {!user.attributes && (
            <p className="text-center text-[9px] text-slate-600 font-bold mt-3">
              No attribute data available yet.
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <span className="text-lg">🕵️‍♂️</span> Scout Report
              </h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={onGetAnalysis}
                className="text-[8px]! px-3!"
              >
                {analysis ? "Refresh" : "Generate"}
              </Button>
            </div>
            {analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-[11px] text-slate-300 leading-relaxed bg-mkr-navy/50 p-4 rounded-xl border-l-2 border-mkr-yellow font-bold">
                  {analysis}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600 text-[10px] font-bold">
                Initialize AI analysis to generate your tactical scout report.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">
                MOTM Awards
              </div>
              <div className="text-xl font-black text-white">
                {user.stats?.motm ?? 0}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">
                Assists
              </div>
              <div className="text-xl font-black text-white">
                {user.stats?.assists ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
