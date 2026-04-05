"use client";

import { motion, Variants } from "framer-motion";
import { Player, Position } from "@/types/types";
import { User } from "next-auth";
import {
  CalendarDays,
  MapPin,
  TrendingUp,
  Zap,
  Target,
  Shield,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface UpcomingMatch {
  id: string;
  date: Date;
  location: string;
  mode: string;
  price: string;
  homeTeam: string[];
  awayTeam: string[];
  maxPlayers: number;
  registeredPlayerIds: string[];
  isPublic: boolean;
}

interface RecentMatch {
  id: string;
  date: Date;
  location: string;
  mode: string;
  homeTeam: string[];
  awayTeam: string[];
  score: { home: number; away: number } | null | undefined;
  completed: boolean;
  matchReport: string | null | undefined;
}

interface Props {
  user: User & {
    role: "player" | "agent";
    phone: string;
    position: Position;
    avatarUrl?: string;
  };
  stats: Player["stats"];
  upcomingMatches: UpcomingMatch[];
  recentMatches: RecentMatch[];
}

// Use cubic-bezier array instead of string — Framer Motion's Easing type
// accepts [number, number, number, number] but not arbitrary strings like "easeOut"
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

function formatMatchDate(date: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getDaysUntil(date: Date) {
  const diff = new Date(date).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export default function Dashboard({
  user,
  stats,
  upcomingMatches,
  recentMatches,
}: Props) {
  const firstName = user.name?.split(" ")[0] ?? "Operative";

  const statCards = [
    {
      label: "Matches Played",
      value: stats?.matchesPlayed ?? 0,
      icon: <Shield size={16} />,
      color: "text-white",
      accent: "border-white/10",
    },
    {
      label: "Goals",
      value: stats?.goals ?? 0,
      icon: <Target size={16} />,
      color: "text-mkr-yellow",
      accent: "border-mkr-yellow/20",
    },
    {
      label: "Assists",
      value: stats?.assists ?? 0,
      icon: <Zap size={16} />,
      color: "text-white",
      accent: "border-white/10",
    },
    {
      label: "Avg Rating",
      value: stats?.rating ?? 0,
      icon: <TrendingUp size={16} />,
      color: "text-emerald-400",
      accent: "border-emerald-500/20",
    },
    {
      label: "MOTM Awards",
      value: stats?.motm ?? 0,
      icon: <Zap size={16} />,
      color: "text-mkr-yellow",
      accent: "border-mkr-yellow/20",
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-12 max-w-6xl mx-auto space-y-10">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight leading-none">
            Welcome back, <span className="text-mkr-yellow">{firstName}</span>
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className={`bg-mkr-dark border ${s.accent} rounded-3xl p-5 flex flex-col gap-3`}
          >
            <div className={`${s.color} opacity-60`}>{s.icon}</div>
            <div>
              <div className={`text-3xl font-black  ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-0.5">
                {s.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-mkr-dark border border-white/5 rounded-[2.5rem] p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ">
                Upcoming Fixtures
              </h2>
              <p className="text-white font-black  uppercase text-lg tracking-tight leading-none mt-0.5">
                Next Deployments
              </p>
            </div>
            <Link
              href="/app/fixtures"
              className="flex items-center gap-1 text-[9px] font-black text-mkr-yellow uppercase tracking-widest hover:underline"
            >
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {upcomingMatches.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays className="mx-auto mb-3 text-slate-700" size={28} />
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest ">
                No upcoming matches. Check the fixtures page.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-mkr-yellow/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[8px] font-black text-mkr-yellow uppercase tracking-widest bg-mkr-yellow/10 px-2 py-0.5 rounded-full border border-mkr-yellow/20">
                          {m.mode}
                        </span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          {getDaysUntil(m.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">{m.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[9px] font-bold mt-1">
                        <Clock size={10} className="shrink-0" />
                        {formatMatchDate(m.date)}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="flex items-center gap-1 text-slate-500 text-[9px] font-bold">
                        <Users size={10} />
                        {m.registeredPlayerIds.length}/{m.maxPlayers}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-mkr-dark border border-white/5 rounded-[2.5rem] p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ">
                Recent Results
              </h2>
              <p className="text-white font-black  uppercase text-lg tracking-tight leading-none mt-0.5">
                Last Operations
              </p>
            </div>
            <Link
              href="/app/fixtures"
              className="flex items-center gap-1 text-[9px] font-black text-mkr-yellow uppercase tracking-widest hover:underline"
            >
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {recentMatches.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="mx-auto mb-3 text-slate-700" size={28} />
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest ">
                No completed matches yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {m.mode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">{m.location}</span>
                      </div>
                      <div className="text-slate-600 text-[9px] font-bold mt-0.5">
                        {formatMatchDate(m.date)}
                      </div>
                    </div>
                    {m.score ? (
                      <div className="shrink-0 flex items-center gap-1.5 bg-mkr-navy px-3 py-1.5 rounded-xl border border-white/10">
                        <span className="text-white font-black text-sm ">
                          {m.score.home}
                        </span>
                        <span className="text-slate-600 text-[10px] font-black">
                          —
                        </span>
                        <span className="text-white font-black text-sm ">
                          {m.score.away}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest  shrink-0">
                        No score
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
