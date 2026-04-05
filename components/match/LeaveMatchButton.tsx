"use client";

import { useTransition } from "react";
import { leaveMatch } from "@/app/(landing)/matches/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeaveMatchButton({ matchId }: { matchId: string }) {
  const [pending, startTransition] = useTransition();

  const handleLeave = () => {
    startTransition(async () => {
      try {
        await leaveMatch(matchId);
        toast.success(
          "You have left the match. You will receive a refund if applicable.",
          {
            duration: 5000,
          },
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={handleLeave}
      className="w-full py-5! shadow-[0_0_20px_rgba(255,234,0,0.1)]"
    >
      {pending ? "Leaving..." : "Leave Match"}
    </Button>
  );
}
