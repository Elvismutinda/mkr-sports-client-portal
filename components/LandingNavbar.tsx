"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { navLinks } from "@/config/nav";
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-mkr-navy/90 backdrop-blur-md border-b border-white/5 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <div className="flex items-center shrink-0">
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

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200",
                    isActive
                      ? "text-mkr-yellow"
                      : "text-slate-400 hover:text-mkr-yellow",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex">
          {user ? (
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

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "rotate-45 translate-y-2",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "-rotate-45 -translate-y-2",
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="bg-mkr-navy border-t border-white/5 px-6 pt-6 pb-8 flex flex-col gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "text-md font-bold uppercase tracking-tight transition-colors",
                  isActive
                    ? "text-mkr-yellow"
                    : "text-slate-200 hover:text-mkr-yellow",
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="border-t border-white/10 pt-6">
            {user ? (
              <Link
                href="/app/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-mkr-yellow transition-colors"
              >
                Proceed to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-md font-bold uppercase tracking-widest text-slate-300 hover:text-mkr-yellow transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
