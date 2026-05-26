import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getAirport } from "@/lib/airports";
import { jsonError } from "@/lib/apiErrors";
import { toSchedulePublic } from "@/lib/serialize";
import { localDateRangeToUTC } from "@/lib/timezones";
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

  const originIcao = orig.toUpperCase();
  const originAirport = getAirport(originIcao);
  const originTz = originAirport?.timezone ?? "Pacific/Auckland";
  const { start, end } = localDateRangeToUTC(date1, date2, originTz);

  try {
    const db = await getDb();
    const docs = await db
      .collection<Schedule>("schedules")
      .find({
        origin: originIcao,
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
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("MONGODB_URI")) {
      return jsonError(msg, 500);
    }
    return jsonError("Failed to search schedules.", 500);
  }
}
