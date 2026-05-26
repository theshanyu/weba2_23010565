import { config } from "dotenv";
config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import { addDays, format } from "date-fns";
import { AIRPORTS } from "../lib/airports";
import { FLIGHT_TEMPLATES } from "../lib/timetable";
import { localToUTC, addDuration, formatInTz } from "../lib/timezones";
import type { Schedule } from "../lib/types";

const DAYS_AHEAD = 60;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("dairyflat");

  console.log("Seeding airports...");
  await db.collection("airports").deleteMany({});
  await db.collection("airports").insertMany(AIRPORTS);

  console.log("Generating schedules for", DAYS_AHEAD, "days...");
  await db.collection("schedules").deleteMany({});

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const schedules: Schedule[] = [];

  for (let d = 0; d < DAYS_AHEAD; d++) {
    const day = addDays(start, d);
    const dateStr = format(day, "yyyy-MM-dd");
    const dow = day.getDay();

    for (const tpl of FLIGHT_TEMPLATES) {
      if (!tpl.daysOfWeek.includes(dow)) continue;

      const departUTC = localToUTC(
        dateStr,
        tpl.departLocalTime,
        tpl.originTz
      );
      const arriveUTC = addDuration(departUTC, tpl.durationMin);
      const departLocal = formatInTz(departUTC, tpl.originTz);
      const arriveLocal = formatInTz(arriveUTC, tpl.destTz);

      schedules.push({
        flightNo: tpl.flightNo,
        origin: tpl.origin,
        destination: tpl.destination,
        aircraft: tpl.aircraft,
        capacity: tpl.capacity,
        departUTC,
        arriveUTC,
        departLocal,
        arriveLocal,
        originTz: tpl.originTz,
        destTz: tpl.destTz,
        durationMin: tpl.durationMin,
        priceNZD: tpl.priceNZD,
        bookings: [],
      });
    }
  }

  if (schedules.length > 0) {
    await db.collection("schedules").insertMany(schedules);
  }

  console.log(`Inserted ${schedules.length} schedule documents.`);

  await db.collection("schedules").createIndex({ departUTC: 1 });
  await db
    .collection("schedules")
    .createIndex({ origin: 1, destination: 1, departUTC: 1 });
  await db.collection("schedules").createIndex({ "bookings.ref": 1 });
  await db.collection("passengers").createIndex({ email: 1 }, { unique: true });

  await client.close();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
