import SiteFooter from "@/components/SiteFooter";
import { buttonVariants } from "@/components/ui/button";
import UpcomingGamesCard from "@/components/UpcomingGamesCard";

import { cn } from "@/lib/utils";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function IndexPage() {
  const response = await fetch(`${BASE_URL}/api/matches`, {
    cache: "no-store",
  });

  const matches = await response.json();

  return (
    <>
      <section className="pt-40 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-mkr-yellow/5 rounded-full blur-[150px] -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-mkr-yellow/10 border border-mkr-yellow/20 rounded-full mb-6">
            <span className="text-mkr-yellow text-xs font-black uppercase tracking-widest">
              The Future of Sunday League
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-none uppercase">
            Dominate Your <span className="text-mkr-yellow">Pitch</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Professional-grade match tracking, AI scouting, and squad management
            for the elite amateur athlete.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="#matches"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              Find a Game
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" })
              )}
            >
              Register Team
            </Link>
          </div>
        </div>
      </section>

      <UpcomingGamesCard matches={matches} />

      <SiteFooter />
    </>
  );
}
