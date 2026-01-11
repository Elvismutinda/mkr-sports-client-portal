"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { startMatchPayment } from "@/app/(landing)/matches/actions";
import {
  MatchRegisterRequest,
  MatchRegisterSchema,
} from "@/lib/validations/match";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Match } from "@/types/types";

interface Props {
  match: Match;
}

const RegisterMatchForm = ({ match }: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MatchRegisterRequest>({
    resolver: zodResolver(MatchRegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const handleMatchRegister = (values: MatchRegisterRequest) => {
  startTransition(async () => {
    await startMatchPayment(match.id, `254${values.phone}`);
    toast.success("Check your phone to complete payment");
  });
};


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleMatchRegister)}
          className="space-y-6"
        >
          <div className="space-y-4 animate-fade-in">
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
                      className="w-full h-14 bg-mkr-navy/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white placeholder-slate-700 outline-none focus:ring-1! focus:ring-mkr-yellow! transition-all"
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
                    Phone Number
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
                        className="w-full h-14 bg-mkr-navy/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white placeholder-slate-700 outline-none focus:ring-1! focus:ring-mkr-yellow! transition-all rounded-l-none"
                        type="tel"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="terms-check" />
            <Label
              htmlFor="terms-check"
              className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest opacity-80"
            >
              By submitting, I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                className="text-mkr-yellow hover:underline"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/refund-policy"
                className="text-mkr-yellow hover:underline"
              >
                Refund Policy
              </Link>
              .
            </Label>
          </div>

          <div>
            <Button
              size="lg"
              type="submit"
              className="w-full py-6 shadow-xl shadow-mkr-yellow/5 text-xs"
              disabled={isPending}
            >
              Complete Registration (KSH. {match.price})
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RegisterMatchForm;
