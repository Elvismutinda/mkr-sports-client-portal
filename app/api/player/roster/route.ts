import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { teamMember, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Player } from "@/types/types";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Find the team(s) this player belongs to
  const memberships = await db
    .select({ teamId: teamMember.teamId })
    .from(teamMember)
    .where(and(eq(teamMember.playerId, userId), eq(teamMember.isActive, true)));

  if (memberships.length === 0) {
    return NextResponse.json<Player[]>([]);
  }

  // Use the first active team (adjust if players can be on multiple teams)
  const teamId = memberships[0].teamId;

  // Fetch all active members of that team with their user profiles
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      isActive: user.isActive,
      position: teamMember.position,
      stats: user.stats,
      attributes: user.attributes,
      aiAnalysis: user.aiAnalysis,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(teamMember)
    .innerJoin(user, eq(teamMember.playerId, user.id))
    .where(and(eq(teamMember.teamId, teamId), eq(teamMember.isActive, true)));

  const players: Player[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    avatarUrl: r.avatarUrl ?? null,
    bio: r.bio ?? null,
    role: r.role,
    isActive: r.isActive,
    // teamMember.position takes precedence over user.position for roster context
    position: r.position ?? null,
    stats: r.stats ?? {
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      motm: 0,
      rating: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    },
    attributes: r.attributes ?? null,
    aiAnalysis: r.aiAnalysis ?? null,
    lastLoginAt: r.lastLoginAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return NextResponse.json(players);
}
