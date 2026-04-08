"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomHeader } from "@/components/CustomHeader";
import { EmptyRoster } from "@/components/roster/EmptyRoster";
import { PlayerGrid } from "@/components/roster/PlayerGrid";
import { InvitePlayerModal } from "@/components/roster/invite/InvitePlayerModal";
import { CreateTeamModal } from "@/components/roster/register/CreateTeamModal";
import { TeamRoleAlert } from "@/components/roster/register/TeamRoleAlert";
import { WaitingForInvite } from "@/components/roster/register/WaitingForInvite";
import { Player } from "@/types/types";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

interface MyTeam {
  id: string;
  name: string;
  badgeFallback: string | null;
}

type NoTeamStep = "idle" | "alert" | "create" | "waiting";

export default function SquadPage() {
  const [players, setPlayers] = useState<(Player & { isCaptain: boolean })[]>(
    [],
  );
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null);
  const [isCaptain, setIsCaptain] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [noTeamStep, setNoTeamStep] = useState<NoTeamStep>("idle");

  const fetchRoster = useCallback(async () => {
    try {
      const [rosterRes, teamRes] = await Promise.all([
        fetch("/api/player/roster"),
        fetch("/api/team/mine"),
      ]);
      const [roster, teamData] = await Promise.all([
        rosterRes.json(),
        teamRes.json(),
      ]);
      setPlayers(Array.isArray(roster) ? roster : []);
      setMyTeam(teamData?.team ?? null);
      setIsCaptain(teamData?.isCaptain ?? false);

      // If no team yet and we haven't started the flow, show the alert
      if (!teamData?.team) {
        setNoTeamStep("alert");
      }
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handlePlayerRemoved = useCallback((removedId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== removedId));
  }, []);

  const handleTeamCreated = useCallback(() => {
    setNoTeamStep("idle");
    fetchRoster();
  }, [fetchRoster]);

  return (
    <div className="px-6 py-12 md:px-16">
      <div className="flex items-start justify-between">
        <CustomHeader
          title="Team Members"
          subtitle="Your team, roster, and player profiles"
          activeCount={players.length}
        />

        {myTeam && isCaptain && (
          <Button onClick={() => setShowInvite(true)} variant="primary">
            <UserPlus className="w-4 h-4" />
            Add Player
          </Button>
        )}
      </div>

      {loading ? (
        <RosterSkeleton />
      ) : !myTeam ? (
        noTeamStep === "waiting" ? (
          <WaitingForInvite />
        ) : (
          <NoTeamState onRegister={() => setNoTeamStep("alert")} />
        )
      ) : players.length === 0 ? (
        <EmptyRoster
          onInvite={isCaptain ? () => setShowInvite(true) : undefined}
        />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {myTeam.name}
            </h2>
          </div>

          <PlayerGrid
            players={players}
            onRemove={isCaptain ? handlePlayerRemoved : undefined}
          />
        </>
      )}

      {noTeamStep === "alert" && (
        <TeamRoleAlert
          onCaptain={() => setNoTeamStep("create")}
          onDismiss={() => setNoTeamStep("waiting")}
        />
      )}

      {noTeamStep === "create" && (
        <CreateTeamModal
          onClose={() => setNoTeamStep("idle")}
          onCreated={handleTeamCreated}
        />
      )}

      {showInvite && myTeam && isCaptain && (
        <InvitePlayerModal
          teamId={myTeam.id}
          onClose={() => setShowInvite(false)}
          onInvited={fetchRoster}
        />
      )}
    </div>
  );
}

function NoTeamState({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-[1.75rem] border-2 border-dashed border-white/10">
      <Users className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-slate-600" />
      <p className="text-sm font-black uppercase tracking-widest text-slate-600">
        No Team Found
      </p>
      <p className="text-xs font-black uppercase tracking-widest text-slate-700 mt-1 mb-6">
        Register a team or wait for a captain&apos;s invite.
      </p>
      <Button onClick={onRegister} variant="primary">
        Get Started
      </Button>
    </div>
  );
}

function RosterSkeleton() {
  return (
    <>
      <div className="mb-6">
        <div className="h-6 w-1/5 rounded bg-white/5" />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-[#0d1117] p-5 flex flex-col gap-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/5 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-2/3 rounded bg-white/5" />
                <div className="h-3 w-1/2 rounded bg-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-16 rounded-xl bg-white/5" />
              ))}
            </div>
            <div className="h-4 rounded bg-white/5" />
          </div>
        ))}
      </section>
    </>
  );
}
