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
    >
      {pending ? "Leaving..." : "Leave Match"}
    </Button>
  );
}
