import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { team, teamMember, tournamentTeam, user } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

/**
 * GET /api/my-teams?tournamentId=<id>
 *
 * Returns all active teams the current user belongs to, along with their
 * active members. If `tournamentId` is provided, members who are already
 * part of an enlisted team for that tournament are flagged as
 * `alreadyRegistered`.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId") ?? undefined;

  // 1. Find teams the user belongs to
  const memberships = await db
    .select({ teamId: teamMember.teamId })
    .from(teamMember)
    .where(
      and(eq(teamMember.playerId, userId), eq(teamMember.isActive, true))
    );

  if (memberships.length === 0) {
    return NextResponse.json([]);
  }

  const teamIds = memberships.map((m) => m.teamId);

  // 2. Fetch team details
  const teams = await db
    .select({
      id: team.id,
      name: team.name,
      badgeFallback: team.badgeFallback,
      badgeUrl: team.badgeUrl,
    })
    .from(team)
    .where(and(inArray(team.id, teamIds), eq(team.isActive, true)));

  if (teams.length === 0) {
    return NextResponse.json([]);
  }

  // 3. If tournamentId provided, find teams already registered for it
  //    so we can flag their members appropriately.
  let alreadyRegisteredTeamIds = new Set<string>();
  if (tournamentId) {
    const registered = await db
      .select({ teamId: tournamentTeam.teamId })
      .from(tournamentTeam)
      .where(eq(tournamentTeam.tournamentId, tournamentId));
    alreadyRegisteredTeamIds = new Set(registered.map((r) => r.teamId));
  }

  // 4. For each team, fetch active members with user details
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
        .where(
          and(eq(teamMember.teamId, t.id), eq(teamMember.isActive, true))
        );

      // Mark members as already registered if their team is already in the tournament
      const teamIsRegistered = alreadyRegisteredTeamIds.has(t.id);

      return {
        id: t.id,
        name: t.name,
        badgeFallback: t.badgeFallback,
        badgeUrl: t.badgeUrl,
        members: members.map((m) => ({
          playerId: m.playerId,
          name: m.name,
          position: m.position,
          avatarUrl: m.avatarUrl,
          // If the team itself is already registered, all its members are "taken"
          alreadyRegistered: teamIsRegistered,
        })),
      };
    })
  );

  return NextResponse.json(teamsWithMembers);
}