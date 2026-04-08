import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-30 pb-24 px-4 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-248 h-148 bg-mkr-yellow/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-none uppercase tracking-tighter">
          Dominate Your <span className="text-mkr-yellow">Pitch</span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
          Professional-grade match tracking, AI scouting, and squad management
          for the elite amateur athlete.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          <Link
            href="/turfs"
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            Search Turfs
          </Link>
          <Link
            href="/teams"
            className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
          >
            Challenge Teams
          </Link>
        </div>
      </div>
    </section>
  );
}
