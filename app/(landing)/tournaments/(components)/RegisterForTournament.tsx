"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LoaderCircle,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

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
}

type Step = "team" | "members" | "confirm";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface Props {
  tournamentId: string;
  entryFee: number;
}

export default function RegisterForTournament({
  tournamentId,
  entryFee,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [step, setStep] = useState<Step>("team");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  useEffect(() => {
    fetch(`/api/my-teams?tournamentId=${tournamentId}`)
      .then((r) => r.json())
      .then((data) => setTeams(data))
      .catch(() => toast.error("Failed to load your teams"))
      .finally(() => setLoadingTeams(false));
  }, [tournamentId]);

  const toggleMember = (playerId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleRegister = () => {
    if (!agreed) {
      setError("You must acknowledge the campaign protocol to proceed.");
      return;
    }
    if (!selectedTeamId || selectedMemberIds.length === 0) {
      setError("Select a team and at least one member.");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: selectedTeamId,
            selectedMemberIds,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Registration failed.");
          return;
        }

        toast.success(
          `${selectedTeam?.name} has been registered for the tournament!`,
        );
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  if (loadingTeams) {
    return (
      <div className="flex items-center justify-center py-8 gap-3 text-slate-400">
        <LoaderCircle className="h-4 w-4 animate-spin text-mkr-yellow" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Loading your teams…
        </span>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center space-y-2">
        <div className="text-amber-400 font-black uppercase text-[10px] tracking-widest">
          No Teams Found
        </div>
        <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
          You must be a member of a team to register in this tournament.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {(["team", "members", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                step === s
                  ? "bg-mkr-yellow text-mkr-navy"
                  : (step === "members" && i === 0) ||
                      (step === "confirm" && i < 2)
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-slate-500 border border-white/10",
              )}
            >
              {(step === "members" && i === 0) ||
              (step === "confirm" && i < 2) ? (
                <Check className="w-3 h-3" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && <div className="h-px w-5 bg-white/10" />}
          </div>
        ))}
        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {step === "team"
            ? "Select Team"
            : step === "members"
              ? "Pick Members"
              : "Confirm"}
        </span>
      </div>

      {step === "team" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Your Teams
          </p>
          <div className="space-y-2">
            {teams.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTeamId(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all",
                  selectedTeamId === t.id
                    ? "border-mkr-yellow/60 bg-mkr-yellow/5"
                    : "border-white/10 bg-mkr-navy/30 hover:border-white/20",
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-mkr-navy flex items-center justify-center border border-white/10 shrink-0">
                  <span className="text-[11px] font-black text-mkr-yellow">
                    {t.badgeFallback ?? getInitials(t.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-white text-sm uppercase tracking-tight truncate">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                    <Users className="inline w-3 h-3 mr-1" />
                    {t.members.length} member
                    {t.members.length !== 1 ? "s" : ""}
                  </div>
                </div>
                {selectedTeamId === t.id && (
                  <div className="w-5 h-5 rounded-full bg-mkr-yellow flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-mkr-navy" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!selectedTeamId}
            onClick={() => setStep("members")}
            className="w-full"
          >
            Next: Pick Members <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {step === "members" && selectedTeam && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {selectedTeam.name}
            </p>
            {selectedMemberIds.length > 0 && (
              <span className="text-[10px] font-black text-mkr-yellow uppercase">
                {selectedMemberIds.length} selected
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {selectedTeam.members.map((member) => {
              const isSelected = selectedMemberIds.includes(member.playerId);
              const isDisabled = member.alreadyRegistered;

              return (
                <button
                  key={member.playerId}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && toggleMember(member.playerId)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                    isDisabled
                      ? "opacity-40 cursor-not-allowed border-white/5"
                      : isSelected
                        ? "border-mkr-yellow/60 bg-mkr-yellow/5"
                        : "border-white/10 bg-mkr-navy/30 hover:border-white/20",
                  )}
                >
                  <div className="w-7 h-7 rounded-full border border-white/10 bg-mkr-navy flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black text-mkr-yellow">
                      {getInitials(member.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-white uppercase tracking-tight truncate">
                      {member.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold">
                      {isDisabled
                        ? "Already registered"
                        : (member.position ?? "Player")}
                    </div>
                  </div>
                  {!isDisabled && (
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "bg-mkr-yellow border-mkr-yellow"
                          : "border-white/20",
                      )}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 text-mkr-navy" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep("team")}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={selectedMemberIds.length === 0}
              onClick={() => setStep("confirm")}
              className="flex-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && selectedTeam && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-mkr-navy/50 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Registration Summary
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold">Team</span>
              <span className="text-white font-black uppercase">
                {selectedTeam.name}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold">Members</span>
              <span className="text-white font-black">
                {selectedMemberIds.length}
              </span>
            </div>
            {entryFee > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-slate-400 font-bold">Entry Fee</span>
                <span className="text-mkr-yellow font-black">
                  KSH{" "}
                  {new Intl.NumberFormat("en-KE", {
                    minimumFractionDigits: 2,
                  }).format(entryFee)}
                </span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                  agreed
                    ? "bg-mkr-yellow border-mkr-yellow"
                    : "border-white/20 bg-transparent group-hover:border-white/40",
                )}
              >
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#0a0f1a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">
              I acknowledge the tournament rules and confirm this team&apos;s
              eligibility to participate.
            </span>
          </label>

          {error && (
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep("members")}
              disabled={isPending}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleRegister}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Register Team
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
