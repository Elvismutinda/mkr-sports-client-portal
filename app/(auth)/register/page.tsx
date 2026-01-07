import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for a new account",
};

const RegisterPage = () => {
  return (
    <>
      <div className="flex justify-between items-start mb-10">
        <Link
          href="/"
          className={cn(
            "text-slate-500 hover:text-mkr-yellow transition-colors bg-white/5 p-2 rounded-xl group"
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="text-2xl font-black text-white italic leading-none">
            MKR
          </span>
          <svg
            className="w-6 h-6 mkr-bolt animate-bolt-flash"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-sm font-bold text-mkr-yellow uppercase tracking-[0.2em]">Sports</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
          Join the Squad
        </h1>
        {/* <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">
          Access the ultimate football management platform
        </p> */}
      </div>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
