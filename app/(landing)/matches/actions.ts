"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { match, matchPlayers, payments } from "@/lib/db/schema";
import { stkPush } from "@/lib/mpesa";
import { count, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function enlistForMatch(matchId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Fetch match
  const [foundMatch] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId));

  if (!foundMatch) {
    return { error: "Match not found" };
  }

  if (foundMatch.completed) {
    return { error: "Match already completed" };
  }

  // Count players
  const [{ value: playerCount }] = await db
    .select({ value: count() })
    .from(matchPlayers)
    .where(eq(matchPlayers.matchId, matchId));

  if (playerCount >= foundMatch.maxPlayers) {
    return { error: "Match is full" };
  }

  await db.insert(matchPlayers).values({
    matchId,
    playerId: userId,
    position: session.user.position,
  });

  // Revalidate the match page
  revalidatePath(`/matches/${matchId}`);
}

export async function leaveMatch(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(matchPlayers)
    .where(
      and(
        eq(matchPlayers.matchId, matchId),
        eq(matchPlayers.playerId, session.user.id)
      )
    );

  revalidatePath(`/matches/${matchId}`);
}

export async function startMatchPayment(matchId: string, phone: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const [foundMatch] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId));

  if (!foundMatch) throw new Error("Match not found");

  // 🔒 Slot check
  const [{ value: countPlayers }] = await db
    .select({ value: count() })
    .from(matchPlayers)
    .where(eq(matchPlayers.matchId, matchId));

  if (countPlayers >= foundMatch.maxPlayers) {
    throw new Error("Match full");
  }

  // Create payment record
  const [payment] = await db
    .insert(payments)
    .values({
      userId,
      matchId,
      phone,
      amount: foundMatch.price.toString(),
    })
    .returning();

  // Trigger STK Push
  const stk = await stkPush({
    phone,
    amount: Number(foundMatch.price),
    accountRef: `MATCH-${matchId}`,
    description: "Match Registration",
  });

  await db
    .update(payments)
    .set({ checkoutRequestId: stk.CheckoutRequestID })
    .where(eq(payments.id, payment.id));

  return { success: true };
}
