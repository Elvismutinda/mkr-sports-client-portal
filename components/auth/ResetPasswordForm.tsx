"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordRequest,
  resetPasswordSchema,
} from "@/lib/validations/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/app/(auth)/reset-password/actions";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { PasswordStrengthBar } from "../PasswordStrengthBar";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<
    "validating" | "valid" | "invalid"
  >(token ? "validating" : "invalid");
  const [tokenMessage] = useState(
    token ? "Validating reset link…" : "Missing or invalid reset token.",
  );

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) return;
    const t = setTimeout(() => setTokenStatus("valid"), 600);
    return () => clearTimeout(t);
  }, [token]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedPassword = form.watch("password");

  const isSuccess =
    form.formState.isSubmitSuccessful && !form.formState.errors.root;

  const handleSubmit = (values: ResetPasswordRequest) => {
    if (!token) return;
    startTransition(async () => {
      const result = await resetPassword(token, values.password);
      if (result.error) {
        form.setError("root", { message: result.error });
      }
    });
  };

  return (
    <div className="min-h-screen bg-mkr-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-80 bg-mkr-yellow rounded-full blur-[150px]" />
      </div>

      <div className="w-100 bg-mkr-dark/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.7)] p-10 flex flex-col relative z-10 animate-fade-in">
        {/* Validating state */}
        {tokenStatus === "validating" && (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-8">
            <div className="relative">
              <svg
                className="w-16 h-16 mkr-bolt animate-bolt-flash"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <div className="absolute inset-0 w-16 h-16 border-4 border-mkr-yellow/10 border-t-mkr-yellow rounded-full animate-spin" />
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-mkr-yellow rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              {tokenMessage}
            </p>
          </div>
        )}

        {/* Invalid token state */}
        {tokenStatus === "invalid" && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="bg-red-500 p-5 rounded-3xl shadow-lg shadow-red-500/20">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-tight text-lg mb-1">
                Invalid Link
              </p>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">
                {tokenMessage}
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="w-full h-12 bg-mkr-yellow text-mkr-navy font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-mkr-yellow/90 transition-all"
            >
              Request New Link
            </Link>
          </div>
        )}

        {/* Success state */}
        {tokenStatus === "valid" && isSuccess && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="bg-mkr-yellow p-5 rounded-3xl shadow-lg shadow-mkr-yellow/20 animate-bounce">
              <svg
                className="w-10 h-10 text-mkr-navy"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-tight text-lg mb-1">
                Password Updated
              </p>
              <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-xs">
                Password updated successfully. You can now sign in.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full h-12 bg-mkr-yellow text-mkr-navy font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-mkr-yellow/90 transition-all"
            >
              Login
            </Link>
          </div>
        )}

        {/* Form */}
        {tokenStatus === "valid" && !isSuccess && (
          <>
            <div className="mb-8">
              <p className="text-[11px] font-black text-mkr-yellow uppercase tracking-[0.25em] mb-2">
                Account Recovery
              </p>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                New Password
              </h1>
              <p className="text-slate-500 text-xs font-bold mt-3 leading-relaxed">
                Choose a strong password for your MKR Sports account.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isPending}
                            className="w-full h-14 bg-mkr-navy/50 border border-white/10 rounded-xl px-5 pr-12 text-sm font-bold text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-mkr-yellow transition-all disabled:opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <PasswordStrengthBar password={watchedPassword} />
                      <FormMessage className="text-[9px] font-black uppercase tracking-widest text-red-400 ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirm ? "text" : "password"}
                            disabled={isPending}
                            className="w-full h-14 bg-mkr-navy/50 border border-white/10 rounded-xl px-5 pr-12 text-sm font-bold text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-mkr-yellow transition-all disabled:opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            tabIndex={-1}
                          >
                            {showConfirm ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[9px] font-black uppercase tracking-widest text-red-400 ml-1" />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-1">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-14 bg-mkr-yellow text-mkr-navy font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-mkr-yellow/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-mkr-yellow/10"
                >
                  {isPending ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </form>
            </Form>
          </>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-1 pt-6 border-t border-white/5 opacity-50">
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
}
