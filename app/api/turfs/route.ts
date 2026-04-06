import { db } from "@/lib/db/db";
import { turf } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const turfs = await db
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
      .where(eq(turf.isActive, true));

    // Build mapsQuery from available location data
    const mapped = turfs.map((t) => ({
      ...t,
      rating: t.rating ? Number(t.rating) : 0,
      pricePerHour: t.pricePerHour ? Number(t.pricePerHour) : null,
      mapsQuery: [t.name, t.area, t.city].filter(Boolean).join(" "),
    }));

    return NextResponse.json({ data: mapped }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/turfs]", error);
    return NextResponse.json(
      { error: "Failed to fetch turfs" },
      { status: 500 },
    );
  }
}