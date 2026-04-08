"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { LoaderCircle, Users, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { toast } from "sonner";
import { startTeamMatchPayment, getMyTeamsForMatch } from "@/app/(landing)/matches/actions";
import { MatchRegisterSchema, MatchRegisterRequest } from "@/lib/validations/match";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";
import { Match } from "@/types/types";
import { cn } from "@/lib/utils";

interface TeamMemberOption {
  playerId: string;
  name: string;
  position: string | null;
  avatarUrl: string | null;
  alreadyRegistered: boolean;
}

interface TeamOption {
  id: string;
  name: string;
  badgeFallback: string | null;
  members: TeamMemberOption[];
  maxPlayers: number;
}

type Step = "team" | "players" | "payment";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export default function RegisterMatchForm({ match }: { match: Match }) {
  const [isPending, startTransition] = useTransition();
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [step, setStep] = useState<Step>("team");

  const form = useForm<MatchRegisterRequest>({
    resolver: zodResolver(MatchRegisterSchema),
    defaultValues: {
      teamId: "",
      selectedPlayerIds: [],
      phone: "",
      termsAccepted: true,
    },
  });

  const selectedTeamId = useWatch<MatchRegisterRequest, "teamId">({
    control: form.control,
    name: "teamId",
    defaultValue: "",
  });
  const selectedPlayerIds = useWatch<MatchRegisterRequest, "selectedPlayerIds">({
    control: form.control,
    name: "selectedPlayerIds",
    defaultValue: [],
  });
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  useEffect(() => {
    getMyTeamsForMatch(match.id)
      .then((data) => setTeams(data as TeamOption[]))
      .catch(() => toast.error("Failed to load your teams"))
      .finally(() => setLoadingTeams(false));
  }, [match.id]);

  const togglePlayer = (playerId: string) => {
    const current = form.getValues("selectedPlayerIds");
    const next = current.includes(playerId)
      ? current.filter((id) => id !== playerId)
      : [...current, playerId];
    form.setValue("selectedPlayerIds", next, { shouldValidate: true });
  };

  const handleSubmit = (values: MatchRegisterRequest) => {
    startTransition(async () => {
      try {
        await startTeamMatchPayment(
          match.id,
          `254${values.phone}`,
          values.teamId,
          values.selectedPlayerIds
        );
        toast.success(
          `Complete payment of KSH. ${(match.price * values.selectedPlayerIds.length).toLocaleString()} on your phone. Check your email once done.`,
          { duration: Infinity }
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const totalAmount = match.price * selectedPlayerIds.length;

  const priceKES = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  if (loadingTeams) {
    return (
      <div className="flex items-center justify-center py-8 gap-3 text-slate-400">
        <LoaderCircle className="h-5 w-5 animate-spin text-mkr-yellow" />
        <span className="text-xs font-black uppercase tracking-widest">Loading your teams…</span>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center space-y-2">
        <div className="text-amber-400 font-black uppercase text-[10px] tracking-widest">
          No Teams Found
        </div>
        <p className="text-xs text-slate-400 font-bold leading-relaxed">
          You need to be part of a team to register for this match.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2">
          {(["team", "players", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                  step === s
                    ? "bg-mkr-yellow text-mkr-navy"
                    : (step === "players" && i === 0) || step === "payment"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-slate-500 border border-white/10"
                )}
              >
                {(step === "players" && i === 0) || (step === "payment" && i < 2) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && <div className="h-px w-6 bg-white/10" />}
            </div>
          ))}
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {step === "team" ? "Select Team" : step === "players" ? "Pick Players" : "Pay"}
          </span>
        </div>

        {/* ── Step 1: Team selection ── */}
        {step === "team" && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Your Teams
            </p>
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    {teams.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => field.onChange(t.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all",
                          field.value === t.id
                            ? "border-mkr-yellow/60 bg-mkr-yellow/5"
                            : "border-white/10 bg-mkr-navy/30 hover:border-white/20"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-mkr-navy flex items-center justify-center border border-white/10 shrink-0">
                          <span className="text-xs font-black text-mkr-yellow">
                            {t.badgeFallback ?? getInitials(t.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-white text-sm uppercase tracking-tight truncate">
                            {t.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                            <Users className="inline w-3 h-3 mr-1" />
                            {t.members.length} member{t.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {field.value === t.id && (
                          <div className="w-5 h-5 rounded-full bg-mkr-yellow flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-mkr-navy" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="w-full"
              disabled={!selectedTeamId}
              onClick={() => setStep("players")}
            >
              Next: Pick Players <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Player selection ── */}
        {step === "players" && selectedTeam && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {selectedTeam.name} — Pick Participants
              </p>
              {selectedPlayerIds.length > 0 && (
                <span className="text-[10px] font-black text-mkr-yellow uppercase">
                  {selectedPlayerIds.length} selected
                </span>
              )}
            </div>

            <FormField
              control={form.control}
              name="selectedPlayerIds"
              render={() => (
                <FormItem>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                    {selectedTeam.members.map((member) => {
                      const isSelected = selectedPlayerIds.includes(member.playerId);
                      const isDisabled = member.alreadyRegistered;

                      return (
                        <button
                          key={member.playerId}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => !isDisabled && togglePlayer(member.playerId)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                            isDisabled
                              ? "opacity-40 cursor-not-allowed border-white/5 bg-white/2"
                              : isSelected
                              ? "border-mkr-yellow/60 bg-mkr-yellow/5"
                              : "border-white/10 bg-mkr-navy/30 hover:border-white/20"
                          )}
                        >
                          <div className="w-8 h-8 rounded-full border border-white/10 bg-mkr-navy flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-mkr-yellow">
                              {getInitials(member.name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-white uppercase tracking-tight truncate">
                              {member.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold">
                              {isDisabled ? "Already registered" : (member.position ?? "Player")}
                            </div>
                          </div>
                          {!isDisabled && (
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                isSelected
                                  ? "bg-mkr-yellow border-mkr-yellow"
                                  : "border-white/20"
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 text-mkr-navy" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPlayerIds.length > 0 && (
              <div className="bg-mkr-navy/50 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Total
                </span>
                <span className="text-mkr-yellow font-black">
                  KSH. {priceKES(totalAmount)}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 opacity-60 hover:opacity-100"
                onClick={() => setStep("team")}
              >
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={selectedPlayerIds.length === 0}
                onClick={() => setStep("payment")}
              >
                Next: Pay <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Payment ── */}
        {step === "payment" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-mkr-navy/50 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                Summary
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Team</span>
                <span className="text-white font-black uppercase">{selectedTeam?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Players</span>
                <span className="text-white font-black">{selectedPlayerIds.length}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-slate-400 font-bold">Total</span>
                <span className="text-mkr-yellow font-black">KSH. {priceKES(totalAmount)}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    M-Pesa Phone Number
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

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        id="terms-check"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <Label
                      htmlFor="terms-check"
                      className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest opacity-80 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link href="/terms-and-conditions" className="text-mkr-yellow hover:underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/refund-policy" className="text-mkr-yellow hover:underline">
                        Refund Policy
                      </Link>
                      .
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 opacity-60 hover:opacity-100"
                onClick={() => setStep("players")}
                disabled={isPending}
              >
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                size="lg"
                type="submit"
                className="flex-1 py-6 shadow-xl shadow-mkr-yellow/5 text-xs"
                disabled={isPending}
              >
                Pay KSH. {priceKES(totalAmount)}
                {isPending && <LoaderCircle className="h-4 w-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}