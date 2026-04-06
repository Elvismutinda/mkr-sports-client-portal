import { db } from "@/lib/db/db";
import { tournament, tournamentParticipant, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: tournamentId } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // 1. Verify tournament exists and is open
    const [t] = await db
      .select({
        id: tournament.id,
        status: tournament.status,
        maxPlayersPerTeam: tournament.maxPlayersPerTeam,
        registrationDeadline: tournament.registrationDeadline,
      })
      .from(tournament)
      .where(eq(tournament.id, tournamentId))
      .limit(1);

    if (!t) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    if (t.status === "COMPLETED") {
      return NextResponse.json(
        { error: "This tournament has already concluded." },
        { status: 400 },
      );
    }

    if (
      t.registrationDeadline &&
      new Date() > new Date(t.registrationDeadline)
    ) {
      return NextResponse.json(
        { error: "Registration deadline has passed." },
        { status: 400 },
      );
    }

    // 2. Verify player exists
    const [player] = await db
      .select({ id: user.id, isActive: user.isActive })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    if (!player.isActive) {
      return NextResponse.json(
        { error: "Your account is not active." },
        { status: 403 },
      );
    }

    // 3. Check not already registered
    const [existing] = await db
      .select({ id: tournamentParticipant.id })
      .from(tournamentParticipant)
      .where(
        and(
          eq(tournamentParticipant.tournamentId, tournamentId),
          eq(tournamentParticipant.playerId, userId),
        ),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this tournament." },
        { status: 409 },
      );
    }

    // 4. Register
    const [registration] = await db
      .insert(tournamentParticipant)
      .values({
        tournamentId,
        playerId: userId,
        paymentStatus: "pending",
      })
      .returning();

    return NextResponse.json(
      { message: "Successfully registered.", data: registration },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/tournaments/:id/register]", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
