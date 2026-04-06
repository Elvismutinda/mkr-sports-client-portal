import { db } from "@/lib/db/db";
import { team, teamMember } from "@/lib/db/schema";
import { eq, ilike, or, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "8", 10)));
    const offset = (page - 1) * limit;

    const whereClause =
      query.length > 0
        ? or(
            ilike(team.name, `%${query}%`),
            ilike(team.type, `%${query}%`),
          )
        : undefined;

    const [teams, [{ total }]] = await Promise.all([
      db
        .select({
          id: team.id,
          name: team.name,
          badgeUrl: team.badgeUrl,
          badgeFallback: team.badgeFallback,
          type: team.type,
          bio: team.bio,
          stats: team.stats,
          memberCount: count(teamMember.id),
        })
        .from(team)
        .leftJoin(teamMember, eq(teamMember.teamId, team.id))
        .where(whereClause)
        .groupBy(team.id)
        .orderBy(team.createdAt)
        .limit(limit)
        .offset(offset),

      db
        .select({ total: count() })
        .from(team)
        .where(whereClause),
    ]);

    return NextResponse.json(
      {
        data: teams,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/teams]", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}