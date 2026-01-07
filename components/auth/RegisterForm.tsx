"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
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

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = (values: RegisterRequest) => {
    startTransition(() => {
      register({
        ...values,
        phone: `+254${values.phone}`, // ensure full phone is sent
      }).then((data) => {
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
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="space-y-6"
        >
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
                      placeholder="Email"
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
                        placeholder="Name"
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
                          placeholder="712345678"
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
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
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
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full h-14 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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

          {/* <p className="text-sm underline text-[#32c06b] cursor-pointer">
            Forgot password?
          </p> */}

          <div>
            <Button
              size="lg"
              type="submit"
              className="w-full mt-6 py-5"
              disabled={isPending}
            >
              Create My Account
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>

          <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed font-black uppercase tracking-widest opacity-80">
            By submitting, I agree to the{" "}
            <Link
              href="/terms-and-conditions"
              className="text-mkr-yellow hover:underline"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-mkr-yellow hover:underline"
            >
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
    </>
  );
};

export default RegisterForm;
