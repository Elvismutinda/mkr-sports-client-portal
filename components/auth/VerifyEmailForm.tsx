"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/(auth)/verify-email/actions";
import { Button } from "../ui/button";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState<string>(
    token ? "Verifying your email address" : "Missing token"
  );

  const onVerified = useCallback(() => {
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmail(token)
      .then((data) => {
        if (data?.error) {
          setStatus("error");
          setMessage(data.error);
        } else {
          setStatus("success");
          setMessage(data?.success || "Verification successful");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong!");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-mkr-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-80 bg-mkr-yellow rounded-full blur-[150px]"></div>
      </div>

      <div className="w-100 bg-mkr-dark/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.7)] p-10 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Account Verification
          </h1>
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.3em] mt-2">
            {message}
          </p>
        </div>

        <div className="mb-10 min-h-25 flex items-center justify-center w-full">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <svg
                  className="w-16 h-16 mkr-bolt animate-bolt-flash"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <div className="absolute inset-0 w-16 h-16 border-4 border-mkr-yellow/10 border-t-mkr-yellow rounded-full animate-spin"></div>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="bg-mkr-yellow p-6 rounded-3xl shadow-lg shadow-mkr-yellow/20 animate-bounce">
              <svg
                className="w-12 h-12 text-mkr-navy"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-500 p-6 rounded-3xl shadow-lg shadow-red-500/20">
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>

        <div className="w-full">
          {status === "success" ? (
            <Button size="lg" className="w-full" onClick={onVerified}>
              Login to Dashboard
            </Button>
          ) : status === "error" ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Return to HomePage
            </Button>
          ) : (
            <div className="text-[12px] text-slate-700 font-black uppercase tracking-widest py-4">
              Synchronizing with Secure Node...
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-1 pt-6 border-t border-white/5 opacity-50 w-full">
          <span className="text-xs font-black text-white">MKR</span>
          <svg
            className="w-3 h-3 text-mkr-yellow"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Sports
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
