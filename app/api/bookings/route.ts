import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { jsonError } from "@/lib/apiErrors";
import { createBookingRef } from "@/lib/bookingRef";
import { toSchedulePublic } from "@/lib/serialize";
import type { Booking, Schedule } from "@/lib/types";

const bodySchema = z.object({
  scheduleId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid request.", 400);
  }

  const { scheduleId, name, email, phone } = parsed.data;
  if (!ObjectId.isValid(scheduleId)) {
    return jsonError("Invalid schedule id.", 400);
  }

  const db = await getDb();
  const schedules = db.collection<Schedule>("schedules");
  const passengers = db.collection("passengers");

  for (let attempt = 0; attempt < 3; attempt++) {
    const ref = createBookingRef();
    const booking: Booking = {
      ref,
      passengerEmail: email.toLowerCase(),
      passengerName: name.trim(),
      passengerPhone: phone?.trim(),
      bookedAt: new Date(),
    };

    const result = await schedules.findOneAndUpdate(
      {
        _id: new ObjectId(scheduleId),
        $expr: { $lt: [{ $size: { $ifNull: ["$bookings", []] } }, "$capacity"] },
      },
      { $push: { bookings: booking } },
      { returnDocument: "after" }
    );

    if (!result) {
      const exists = await schedules.findOne({
        _id: new ObjectId(scheduleId),
      });
      if (!exists) {
        return jsonError("Schedule not found.", 404);
      }
      return jsonError("This flight is fully booked.", 409);
    }

    await passengers.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          email: email.toLowerCase(),
          name: name.trim(),
          ...(phone ? { phone: phone.trim() } : {}),
        },
      },
      { upsert: true }
    );

    const schedule = toSchedulePublic(
      result as Schedule & { _id: ObjectId }
    );

    return NextResponse.json({
      ref,
      booking: {
        ...booking,
        bookedAt: booking.bookedAt.toISOString(),
      },
      schedule,
    });
  }

  return jsonError("Could not generate unique booking reference.", 500);
}
