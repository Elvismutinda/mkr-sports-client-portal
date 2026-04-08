import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TeamChallengeHeader from "./(components)/TeamChallengeHeader";
import ChallengeForm from "./(components)/ChallengeForm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChallengePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const res = await fetch(`${BASE_URL}/api/teams/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();

  const team = await res.json();

  // Check if current user is a captain (has a team)
  let myCaptainTeam: { id: string; name: string } | null = null;
  if (session?.user?.id) {
    const teamRes = await fetch(`${BASE_URL}/api/team/mine`, {
      cache: "no-store",
      headers: { Cookie: "" },
    });
    if (teamRes.ok) {
      const data = await teamRes.json();
      myCaptainTeam = data.team ?? null;
    }
  }

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start">
          <Link
            href="/teams"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 p-2 tracking-normal! opacity-60 hover:opacity-100",
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Teams
          </Link>
        </div>

        <TeamChallengeHeader team={team} />

        <div className="mt-8 bg-[#0d1117] border border-white/10 rounded-[1.75rem] p-8">
          {!session?.user ? (
            <div className="text-center space-y-4 py-8">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                Login to issue a challenge
              </p>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "h-11 text-xs tracking-widest uppercase font-black",
                )}
              >
                Login
              </Link>
            </div>
          ) : !myCaptainTeam ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                You need a team to send a challenge
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-700">
                Create or join a team first.
              </p>
            </div>
          ) : myCaptainTeam.id === team.id ? (
            <div className="text-center py-8">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                You cannot challenge your own team.
              </p>
            </div>
          ) : (
            <ChallengeForm
              challengedTeamId={team.id}
              challengedTeamName={team.name}
              myTeamName={myCaptainTeam.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
