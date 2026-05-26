import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { AIRPORTS } from "@/lib/airports";

export async function GET() {
  try {
    const db = await getDb();
    const count = await db.collection("airports").countDocuments();
    if (count === 0) {
      return NextResponse.json(AIRPORTS);
    }
    const airports = await db.collection("airports").find().sort({ icao: 1 }).toArray();
    return NextResponse.json(airports);
  } catch {
    return NextResponse.json(AIRPORTS);
  }
}
