import { db } from "@/lib/db/db";
import {
  tournament,
  standing,
  tournamentParticipant,
  user,
  team,
} from "@/lib/db/schema";
import { eq, desc, asc, ilike, or, count, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "8", 10)));
    const offset = (page - 1) * limit;

    const publicClause = eq(tournament.isPublic, true);
    const searchClause =
      query.length > 0
        ? or(
            ilike(tournament.name, `%${query}%`),
            ilike(tournament.location, `%${query}%`),
          )
        : undefined;

    const whereClause = searchClause ? and(publicClause, searchClause) : publicClause;

    const [tournaments, [{ total }]] = await Promise.all([
      db
        .select({
          id: tournament.id,
          name: tournament.name,
          description: tournament.description,
          location: tournament.location,
          prizePool: tournament.prizePool,
          entryFee: tournament.entryFee,
          format: tournament.format,
          status: tournament.status,
          startsAt: tournament.startsAt,
          endsAt: tournament.endsAt,
          registrationDeadline: tournament.registrationDeadline,
          maxTeams: tournament.maxTeams,
          maxPlayersPerTeam: tournament.maxPlayersPerTeam,
          isPublic: tournament.isPublic,
          createdAt: tournament.createdAt,
        })
        .from(tournament)
        .where(whereClause)
        .orderBy(desc(tournament.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(tournament).where(whereClause),
    ]);

    const enriched = await Promise.all(
      tournaments.map(async (t) => {
        const [topStandings, participants] = await Promise.all([
          db
            .select({
              rank: standing.rank,
              points: standing.points,
              teamName: team.name,
            })
            .from(standing)
            .leftJoin(team, eq(standing.teamId, team.id))
            .where(eq(standing.tournamentId, t.id))
            .orderBy(asc(standing.rank))
            .limit(3),
          db
            .select({
              id: user.id,
              name: user.name,
              avatarUrl: user.avatarUrl,
            })
            .from(tournamentParticipant)
            .innerJoin(user, eq(tournamentParticipant.playerId, user.id))
            .where(eq(tournamentParticipant.tournamentId, t.id))
            .limit(4),
        ]);

        return {
          ...t,
          prizePool: Number(t.prizePool ?? 0),
          entryFee: Number(t.entryFee ?? 0),
          commencement: t.startsAt
            ? new Date(t.startsAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })
            : null,
          standings: topStandings.map((s) => ({
            rank: s.rank,
            name: s.teamName ?? "Unknown",
            points: s.points,
          })),
          participants,
        };
      }),
    );

    return NextResponse.json(
      {
        data: enriched,
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
    console.error("[GET /api/tournaments]", error);
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}