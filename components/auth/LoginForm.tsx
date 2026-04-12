"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, LoginSchema } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { login } from "@/app/(auth)/login/actions";
import { toast } from "sonner";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (values: LoginRequest) => {
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success(data?.success);
        }
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
          <div className="space-y-4 animate-fade-in">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your email"
                      type="email"
                      className="w-full h-12 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        className="w-full h-12 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Link
            href={"/forgot-password"}
            className="text-mkr-yellow hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            Forgot password?
          </Link>

          <div>
            <Button
              size="md"
              type="submit"
              className="w-full mt-6 py-5"
              disabled={isPending}
            >
              Login
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="text-mkr-yellow hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Don&apos;t have an account? Create one
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
