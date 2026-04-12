"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordRequest,
  forgotPasswordSchema,
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
import { forgotPassword } from "@/app/(auth)/forgot-password/actions";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSuccess =
    form.formState.isSubmitSuccessful && !form.formState.errors.root;

  const handleSubmit = (values: ForgotPasswordRequest) => {
    startTransition(async () => {
      const result = await forgotPassword(values.email);
      if (result.error) {
        form.setError("root", { message: result.error });
      } else {
        // Keep the form in a submitted state to show success UI.
        // We don't reset so isSubmitSuccessful stays true.
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="bg-mkr-yellow p-5 rounded-3xl shadow-lg shadow-mkr-yellow/20 animate-bounce">
          <svg
            className="w-10 h-10 text-mkr-navy"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
            <rect x="2" y="6" width="20" height="14" rx="2" />
          </svg>
        </div>

        <div>
          <p className="text-white font-black uppercase tracking-tight text-lg mb-1">
            Check Your Inbox
          </p>
          <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-xs">
            If that email is registered, a reset link has been sent.
          </p>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-3">
            Link expires in 30 minutes
          </p>
        </div>

        <Link
          href="/login"
          className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-mkr-yellow transition-colors"
        >
          Return to Login →
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={isPending}
                  placeholder="you@example.com"
                  className="w-full h-14 bg-mkr-navy/50 border border-white/10 rounded-xl px-5 text-sm font-bold text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-mkr-yellow transition-all disabled:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-1" />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-1">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          variant="primary"
          disabled={isPending}
          className="w-full mt-6 py-5"
        >
          {isPending ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
}
