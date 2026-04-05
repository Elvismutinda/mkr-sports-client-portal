import { auth } from "@/auth";
import { getMyFixtures } from "@/data/fixtures";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const matches = await getMyFixtures(session.user.id);
    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Failed to fetch player matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}
