import { db } from "@/lib/db/db";
import { turf } from "@/lib/db/schema";
import { eq, ilike, or, count, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const offset = (page - 1) * limit;

    const activeClause = eq(turf.isActive, true);
    const searchClause =
      query.length > 0
        ? or(
            ilike(turf.name, `%${query}%`),
            ilike(turf.area, `%${query}%`),
            ilike(turf.city, `%${query}%`),
          )
        : undefined;

    const whereClause = searchClause ? and(activeClause, searchClause) : activeClause;

    const [turfs, [{ total }]] = await Promise.all([
      db
        .select({
          id: turf.id,
          name: turf.name,
          area: turf.area,
          city: turf.city,
          rating: turf.rating,
          amenities: turf.amenities,
          address: turf.address,
          surface: turf.surface,
          pricePerHour: turf.pricePerHour,
          capacity: turf.capacity,
          images: turf.images,
          latitude: turf.latitude,
          longitude: turf.longitude,
        })
        .from(turf)
        .where(whereClause)
        .orderBy(turf.name)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(turf).where(whereClause),
    ]);

    const data = turfs.map((t) => ({
      ...t,
      rating: t.rating ? Number(t.rating) : 0,
      pricePerHour: t.pricePerHour ? Number(t.pricePerHour) : null,
      mapsQuery: [t.name, t.area, t.city].filter(Boolean).join(" "),
    }));

    return NextResponse.json(
      {
        data,
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
    console.error("[GET /api/turfs]", error);
    return NextResponse.json({ error: "Failed to fetch turfs" }, { status: 500 });
  }
}