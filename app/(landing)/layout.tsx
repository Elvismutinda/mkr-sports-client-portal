import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100">
      <header className="fixed top-0 left-0 w-full bg-mkr-navy/90 backdrop-blur-md border-b border-white/5 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-2xl font-black text-white tracking-tighter">
                MKR
              </span>
              <svg
                className="w-6 h-6 mkr-bolt animate-bolt-flash mx-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-sm font-bold text-mkr-yellow uppercase tracking-[0.2em] ml-1">
                Sports
              </span>
            </div>
          </div>
          {session?.user ? (
            <Link
              href="/app/dashboard"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              Proceed to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
