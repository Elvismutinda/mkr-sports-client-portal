import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { match } from "@/lib/db/schema";
import { and, gte, lte, eq } from "drizzle-orm";


export async function GET() {
  try {
    const now = new Date();

    // Start of week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const matches = await db
      .select()
      .from(match)
      .where(
        and(
          eq(match.completed, false),
          eq(match.isPublic, true),
          // gte(match.date, startOfWeek),
          // lte(match.date, endOfWeek)
        )
      )
      .orderBy(match.date);

    return NextResponse.json(matches);
  } catch (error) {
    console.error("[MATCHES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      date,
      location,
      homeTeam,
      awayTeam,
      maxPlayers,
      isPublic,
    } = body;

    if (!date || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [createdMatch] = await db
      .insert(match)
      .values({
        date: new Date(date),
        location,
        
        homeTeam,
        awayTeam,
        maxPlayers,
        isPublic,
      })
      .returning();

    return NextResponse.json(createdMatch, { status: 201 });
  } catch (error) {
    console.error("[MATCHES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
