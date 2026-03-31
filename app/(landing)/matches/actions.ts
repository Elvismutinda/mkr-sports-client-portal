"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { match, matchPlayers, payments } from "@/lib/db/schema";
import { stkPush } from "@/lib/mpesa";
import { count, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function enlistForMatch(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const [foundMatch] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId));

  if (!foundMatch) return { error: "Match not found" };
  if (foundMatch.completed) return { error: "Match already completed" };

  const [{ value: playerCount }] = await db
    .select({ value: count() })
    .from(matchPlayers)
    .where(eq(matchPlayers.matchId, matchId));

  if (playerCount >= foundMatch.maxPlayers) return { error: "Match is full" };

  await db.insert(matchPlayers).values({
    matchId,
    playerId: userId,
    position: session.user.position,
  });

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

  // 1. Fetch & validate match
  const [foundMatch] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId));

  if (!foundMatch) throw new Error("Match not found");
  if (foundMatch.completed) throw new Error("Match already completed");

  // 2. Slot check against matchPlayers (source of truth)
  const [{ value: playerCount }] = await db
    .select({ value: count() })
    .from(matchPlayers)
    .where(eq(matchPlayers.matchId, matchId));

  if (playerCount >= foundMatch.maxPlayers) throw new Error("Match is full");

  // 3. Check for an existing pending payment (user retrying after dismissing STK prompt)
  const [existingPending] = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.userId, userId),
        eq(payments.matchId, matchId),
        eq(payments.status, "pending")
      )
    );

  // 4. Fire STK push BEFORE writing to DB.
  //    If stkPush() throws, no payment record is created — no orphaned rows.
  const stk = await stkPush({
    phone,
    amount: Number(foundMatch.price),
    accountRef: `MATCH-${matchId}`,
    description: "Match Registration",
  });

  if (existingPending) {
    // Reuse the existing record, just refresh the checkoutRequestId
    await db
      .update(payments)
      .set({ checkoutRequestId: stk.CheckoutRequestID })
      .where(eq(payments.id, existingPending.id));
  } else {
    // Insert payment with checkoutRequestId in one atomic step
    await db.insert(payments).values({
      userId,
      matchId,
      phone,
      amount: foundMatch.price.toString(),
      checkoutRequestId: stk.CheckoutRequestID,
      status: "pending",
    });
  }

  return { success: true };
}