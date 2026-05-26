import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { jsonError } from "@/lib/apiErrors";
import { toSchedulePublic } from "@/lib/serialize";
import type { Schedule } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { ref: string } }
) {
  const ref = params.ref.toUpperCase();
  try {
    const db = await getDb();
    const doc = await db.collection<Schedule>("schedules").findOne({
      "bookings.ref": ref,
    });

    if (!doc) {
      return jsonError("Booking not found.", 404);
    }

    const booking = doc.bookings.find((b) => b.ref === ref)!;
    return NextResponse.json({
      booking: {
        ...booking,
        bookedAt:
          booking.bookedAt instanceof Date
            ? booking.bookedAt.toISOString()
            : booking.bookedAt,
      },
      schedule: toSchedulePublic(doc as Schedule & { _id: ObjectId }),
    });
  } catch (e) {
    console.error(e);
    return jsonError("Failed to load booking.", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { ref: string } }
) {
  const ref = params.ref.toUpperCase();
  try {
    const db = await getDb();
    const result = await db.collection<Schedule>("schedules").findOneAndUpdate(
      { "bookings.ref": ref },
      { $pull: { bookings: { ref } } },
      { returnDocument: "after" }
    );

    if (!result) {
      return jsonError("Booking not found.", 404);
    }

    return NextResponse.json({
      message: "Booking cancelled successfully.",
      ref,
    });
  } catch (e) {
    console.error(e);
    return jsonError("Failed to cancel booking.", 500);
  }
}
