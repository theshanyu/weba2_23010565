import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { jsonError } from "@/lib/apiErrors";
import { toSchedulePublic } from "@/lib/serialize";
import type { Schedule } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!ObjectId.isValid(params.id)) {
    return jsonError("Invalid schedule id.", 400);
  }

  try {
    const db = await getDb();
    const doc = await db
      .collection<Schedule>("schedules")
      .findOne({ _id: new ObjectId(params.id) });

    if (!doc) {
      return jsonError("Schedule not found.", 404);
    }

    return NextResponse.json(
      toSchedulePublic(doc as Schedule & { _id: ObjectId })
    );
  } catch (e) {
    console.error(e);
    return jsonError("Failed to load schedule.", 500);
  }
}
