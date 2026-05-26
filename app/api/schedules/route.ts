import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { jsonError } from "@/lib/apiErrors";
import { toSchedulePublic } from "@/lib/serialize";
import type { Schedule } from "@/lib/types";

const querySchema = z.object({
  date1: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  date2: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  orig: z.string().min(3).max(4),
  dest: z.string().min(3).max(4),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return jsonError(
      "Invalid query. Use date1, date2 (YYYY-MM-DD), orig, dest.",
      400
    );
  }

  const { date1, date2, orig, dest } = parsed.data;
  if (date1 > date2) {
    return jsonError("date1 must be on or before date2.", 400);
  }

  const start = new Date(`${date1}T00:00:00.000Z`);
  const end = new Date(`${date2}T23:59:59.999Z`);

  try {
    const db = await getDb();
    const docs = await db
      .collection<Schedule>("schedules")
      .find({
        origin: orig.toUpperCase(),
        destination: dest.toUpperCase(),
        departUTC: { $gte: start, $lte: end },
      })
      .sort({ departUTC: 1 })
      .toArray();

    const flights = docs.map((d) =>
      toSchedulePublic(d as Schedule & { _id: ObjectId })
    );
    return NextResponse.json({ flights, count: flights.length });
  } catch (e) {
    console.error(e);
    return jsonError("Failed to search schedules.", 500);
  }
}
