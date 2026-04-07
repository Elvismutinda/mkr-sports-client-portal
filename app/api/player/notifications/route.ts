import { db } from "@/lib/db/db";
import { notification } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// fetch unread notifications for the current player
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, session.user.id))
      .orderBy(desc(notification.createdAt))
      .limit(30);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("[GET /api/player/notifications]", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PATCH — mark one or all as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, markAllRead } = await req.json();

    if (markAllRead) {
      await db
        .update(notification)
        .set({ isRead: true })
        .where(
          and(
            eq(notification.userId, session.user.id),
            eq(notification.isRead, false),
          ),
        );
      return NextResponse.json({ message: "All marked as read." });
    }

    if (id) {
      await db
        .update(notification)
        .set({ isRead: true })
        .where(
          and(
            eq(notification.id, id),
            eq(notification.userId, session.user.id),
          ),
        );
      return NextResponse.json({ message: "Notification marked as read." });
    }

    return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 });
  } catch (error) {
    console.error("[PATCH /api/player/notifications]", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}