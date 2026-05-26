import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { jsonError } from "@/lib/apiErrors";
import { toSchedulePublic } from "@/lib/serialize";
import type { Schedule } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { email: string } }
) {
  const email = decodeURIComponent(params.email).toLowerCase().trim();
  if (!email.includes("@")) {
    return jsonError("Invalid email address.", 400);
  }

  try {
    const db = await getDb();
    const docs = await db
      .collection<Schedule>("schedules")
      .find({ "bookings.passengerEmail": email })
      .sort({ departUTC: 1 })
      .toArray();

    const bookings = docs.flatMap((doc) => {
      const schedule = toSchedulePublic(doc as Schedule & { _id: ObjectId });
      return doc.bookings
        .filter((b) => b.passengerEmail === email)
        .map((b) => ({
          ref: b.ref,
          passengerEmail: b.passengerEmail,
          passengerName: b.passengerName,
          passengerPhone: b.passengerPhone,
          bookedAt:
            b.bookedAt instanceof Date
              ? b.bookedAt.toISOString()
              : b.bookedAt,
          schedule,
        }));
    });

    bookings.sort(
      (a, b) =>
        new Date(a.schedule.departUTC).getTime() -
        new Date(b.schedule.departUTC).getTime()
    );

    return NextResponse.json({ email, bookings, count: bookings.length });
  } catch (e) {
    console.error(e);
    return jsonError("Failed to load passenger bookings.", 500);
  }
}
