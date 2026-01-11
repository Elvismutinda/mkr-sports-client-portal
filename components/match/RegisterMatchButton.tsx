"use client";

import { useTransition } from "react";
import { enlistForMatch } from "@/app/(landing)/matches/actions";
import { Button } from "@/components/ui/button";

interface Props {
  matchId: string;
}

export default function RegisterMatchButton({ matchId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full py-5! shadow-[0_0_20px_rgba(255,234,0,0.1)]"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await enlistForMatch(matchId);
        })
      }
    >
      {isPending ? "Submitting..." : "Submit Enlistment"}
    </Button>
  );
}
