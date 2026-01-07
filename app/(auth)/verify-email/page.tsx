import { Metadata } from "next";
// import Link from "next/link";
import { Suspense } from "react";

import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
// import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your account",
};

const VerifyEmailPage = () => {
  return (
    <>
      {/* <div className="flex justify-between items-start mb-10">
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
      </div> */}

      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </>
  );
};

export default VerifyEmailPage;