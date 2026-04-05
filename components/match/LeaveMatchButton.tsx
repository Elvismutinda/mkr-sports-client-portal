"use client";

import { useTransition } from "react";
import { leaveMatch } from "@/app/(landing)/matches/actions";
import { Button } from "@/components/ui/button";

export default function LeaveMatchButton({ matchId }: { matchId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() => startTransition(() => leaveMatch(matchId))}
      className="w-full py-5! shadow-[0_0_20px_rgba(255,234,0,0.1)]"
    >
      {pending ? "Leaving..." : "Leave Match"}
    </Button>
  );
}
