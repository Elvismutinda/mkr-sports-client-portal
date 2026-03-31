"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, LoaderCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { register } from "@/app/(auth)/register/actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Position } from "@/types/types";

// sessionStorage key
const FORM_STORAGE_KEY = "mkr_register_step1";
type Step1Fields = Pick<RegisterRequest, "name" | "email" | "phone" | "position">;

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Load persisted step-1 data from sessionStorage
  const getPersistedStep1 = (): Partial<Step1Fields> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const persisted = getPersistedStep1();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: persisted.name ?? "",
      email: persisted.email ?? "",
      phone: persisted.phone ?? "",
      position: persisted.position ?? undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // Persist step-1 fields to sessionStorage whenever they change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((values, { name: fieldName }) => {
      // Only write when a step-1 field changes
      if (
        !fieldName ||
        ["name", "email", "phone", "position"].includes(fieldName)
      ) {
        const payload: Partial<Step1Fields> = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          position: values.position,
        };
        try {
          sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // sessionStorage may be unavailable (e.g. private mode quota)
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Validate only step-1 fields before advancing
  const handleNextStep = async () => {
    const isValid = await form.trigger(["name", "email", "phone", "position"]);
    if (isValid) setStep(2);
  };

  const handleRegister = (values: RegisterRequest) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success(data?.success);
          // Clear persisted data on success
          try { sessionStorage.removeItem(FORM_STORAGE_KEY); } catch {}
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black transition-all duration-300 ${
                  step === s
                    ? "bg-mkr-yellow text-black scale-110"
                    : step > s
                    ? "bg-mkr-yellow/30 text-mkr-yellow"
                    : "bg-white/10 text-slate-500"
                }`}
              >
                {s}
              </div>
              {s === 1 && (
                <div
                  className={`h-px w-10 rounded-full transition-all duration-500 ${
                    step === 2 ? "bg-mkr-yellow/50" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            {step === 1 ? "Your Details" : "Set Password"}
          </span>
        </div>

        <div
          className={`space-y-4 transition-all duration-300 ${
            step === 1 ? "opacity-100 translate-x-0" : "hidden"
          }`}
        >
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
                    className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your name"
                      type="text"
                      className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="h-14 flex items-center px-4 rounded-l-2xl bg-mkr-dark/70 border border-white/10 text-slate-400 font-bold">
                        +254
                      </span>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="XXXXXXXXX"
                        className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700 rounded-l-none"
                        type="tel"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                  Position
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-14! bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow outline-none font-bold placeholder-slate-700">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Position).map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            size="lg"
            onClick={handleNextStep}
            className="w-full mt-6 py-5"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div
          className={`space-y-4 transition-all duration-300 ${
            step === 2 ? "opacity-100 translate-x-0" : "hidden"
          }`}
        >
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
                      className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={isPending}
              className="flex-1 py-5 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <Button
              size="lg"
              type="submit"
              className="flex-1 py-5"
              disabled={isPending}
            >
              Register
              {isPending && <LoaderCircle className="h-4 w-4 ml-1 animate-spin" />}
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed font-black uppercase tracking-widest opacity-80">
          By submitting, I agree to the{" "}
          <Link href="/terms-and-conditions" className="text-mkr-yellow hover:underline">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-mkr-yellow hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-center">
          <Link
            href="/login"
            className="text-mkr-yellow hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;