import { buttonVariants } from "@/components/ui/button";
import { content } from "@/config/other";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-mkr-navy py-16 px-6 text-slate-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "mb-8 p-2 tracking-normal! opacity-60 hover:opacity-100"
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="mr-2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go Back
          </Link>
        </div>

        <header className="mb-16 border-b border-white/10 pb-10">
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 text-white">
            {content.refund.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-0.5 bg-mkr-yellow"></div>
            <p className="text-mkr-yellow text-[10px] font-black uppercase tracking-[0.3em]">
              REVISED: {content.refund.lastUpdated}
            </p>
          </div>
        </header>

        <div className="space-y-16">
          {content.refund.sections.map((section, idx) => (
            <section
              key={idx}
              className="group animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 group-hover:text-mkr-yellow transition-colors">
                {section.heading}
              </h3>
              <p className="text-slate-400 leading-relaxed font-bold border-l-2 border-white/5 pl-6 group-hover:border-mkr-yellow/30 transition-all">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center opacity-40">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black">
              MKR Sports Group
            </span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest">
            &copy; 2026 MKR Sports.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RefundPage;
