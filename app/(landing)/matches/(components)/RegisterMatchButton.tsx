"use client";

import { useTransition } from "react";
import { enlistForMatch } from "@/app/(landing)/matches/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  matchId: string;
}

export default function RegisterMatchButton({ matchId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleEnlist = () => {
    startTransition(async () => {
      try {
        await enlistForMatch(matchId);
        toast.success("Successfully enlisted for the match!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      }
    });
  };

  return (
    <Button
      className="w-full py-5! shadow-[0_0_20px_rgba(255,234,0,0.1)]"
      disabled={isPending}
      onClick={handleEnlist}
    >
      {isPending ? "Submitting..." : "Submit Enlistment"}
    </Button>
  );
}
