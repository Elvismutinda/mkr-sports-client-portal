"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { match, matchPlayer, payment, teamMember, user, team } from "@/lib/db/schema";
import { stkPush } from "@/lib/mpesa";
import { count, eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Fetch teams the current user captains or is a member of, with their active members */
export async function getMyTeamsForMatch(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be logged in");

  const userId = session.user.id;

  // Find all teams the user belongs to
  const memberships = await db
    .select({ teamId: teamMember.teamId })
    .from(teamMember)
    .where(and(eq(teamMember.playerId, userId), eq(teamMember.isActive, true)));

  if (memberships.length === 0) return [];

  const teamIds = memberships.map((m) => m.teamId);

  // Fetch team details
  const teams = await db
    .select({ id: team.id, name: team.name, badgeFallback: team.badgeFallback })
    .from(team)
    .where(inArray(team.id, teamIds));

  // Fetch the match to know maxPlayers so we can warn about capacity
  const [foundMatch] = await db
    .select({ maxPlayers: match.maxPlayers })
    .from(match)
    .where(eq(match.id, matchId));

  // For each team, fetch active members with their user details
  const teamsWithMembers = await Promise.all(
    teams.map(async (t) => {
      const members = await db
        .select({
          playerId: teamMember.playerId,
          position: teamMember.position,
          name: user.name,
          avatarUrl: user.avatarUrl,
        })
        .from(teamMember)
        .innerJoin(user, eq(teamMember.playerId, user.id))
        .where(and(eq(teamMember.teamId, t.id), eq(teamMember.isActive, true)));

      // Filter out players already registered for this match
      const registeredPlayers = await db
        .select({ playerId: matchPlayer.playerId })
        .from(matchPlayer)
        .where(eq(matchPlayer.matchId, matchId));

      const registeredIds = new Set(registeredPlayers.map((r) => r.playerId));

      return {
        ...t,
        members: members.map((m) => ({
          ...m,
          alreadyRegistered: registeredIds.has(m.playerId),
        })),
        maxPlayers: foundMatch?.maxPlayers ?? 14,
      };
    })
  );

  return teamsWithMembers;
}

/**
 * Initiate team-based match payment.
 * The captain pays for all selected players in one STK push (total = price * count).
 * Each player is enlisted after payment confirmation via the callback.
 */
export async function startTeamMatchPayment(
  matchId: string,
  phone: string,
  teamId: string,
  selectedPlayerIds: string[]
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be logged in to register");

  const userId = session.user.id;

  if (selectedPlayerIds.length === 0)
    throw new Error("Select at least one player");

  // 1. Validate match
  const [foundMatch] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId));

  if (!foundMatch) throw new Error("Match not found");
  if (foundMatch.completed) throw new Error("Match already completed");

  // 2. Slot availability check
  const [{ value: currentCount }] = await db
    .select({ value: count() })
    .from(matchPlayer)
    .where(eq(matchPlayer.matchId, matchId));

  const availableSlots = foundMatch.maxPlayers - currentCount;
  if (selectedPlayerIds.length > availableSlots)
    throw new Error(
      `Only ${availableSlots} slot(s) remaining. You selected ${selectedPlayerIds.length} players.`
    );

  // 3. Verify all selected players are active members of the team
  const validMembers = await db
    .select({ playerId: teamMember.playerId, position: teamMember.position })
    .from(teamMember)
    .where(
      and(
        eq(teamMember.teamId, teamId),
        eq(teamMember.isActive, true),
        inArray(teamMember.playerId, selectedPlayerIds)
      )
    );

  if (validMembers.length !== selectedPlayerIds.length)
    throw new Error("Some selected players are not valid members of this team");

  // 4. Check none are already registered
  const alreadyIn = await db
    .select({ playerId: matchPlayer.playerId })
    .from(matchPlayer)
    .where(
      and(
        eq(matchPlayer.matchId, matchId),
        inArray(matchPlayer.playerId, selectedPlayerIds)
      )
    );

  if (alreadyIn.length > 0)
    throw new Error("One or more selected players are already registered for this match");

  // 5. Total amount = price per player * number of selected players
  const totalAmount = Number(foundMatch.price) * selectedPlayerIds.length;

  // 6. Check for existing pending payment from this user for this match
  const [existingPending] = await db
    .select()
    .from(payment)
    .where(
      and(
        eq(payment.userId, userId),
        eq(payment.matchId, matchId),
        eq(payment.status, "pending")
      )
    );

  // 7. Fire STK push
  const stk = await stkPush({
    phone,
    amount: totalAmount,
    accountRef: `MATCH-${matchId.slice(0, 8)}`,
    description: `${selectedPlayerIds.length} player(s)`,
  });

  // 8. Store payment record with selected player IDs in metadata
  const metadata = {
    teamId,
    selectedPlayerIds,
    playerCount: selectedPlayerIds.length,
  };

  if (existingPending) {
    await db
      .update(payment)
      .set({
        checkoutRequestId: stk.CheckoutRequestID,
        amount: totalAmount.toString(),
        metadata,
      })
      .where(eq(payment.id, existingPending.id));
  } else {
    await db.insert(payment).values({
      userId,
      matchId,
      phone,
      amount: totalAmount.toString(),
      checkoutRequestId: stk.CheckoutRequestID,
      status: "pending",
      metadata,
    });
  }

  return { success: true };
}

/** Leave a match — removes the current user's own player record */
export async function leaveMatch(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be logged in to leave a match");

  await db
    .delete(matchPlayer)
    .where(
      and(
        eq(matchPlayer.matchId, matchId),
        eq(matchPlayer.playerId, session.user.id)
      )
    );

  revalidatePath(`/matches/${matchId}`);
}