import type { Schedule, SchedulePublic } from "./types";
import type { ObjectId } from "mongodb";

export function toSchedulePublic(
  doc: Schedule & { _id: ObjectId }
): SchedulePublic {
  const bookedCount = doc.bookings?.length ?? 0;
  return {
    id: doc._id.toString(),
    flightNo: doc.flightNo,
    origin: doc.origin,
    destination: doc.destination,
    aircraft: doc.aircraft,
    capacity: doc.capacity,
    departUTC: doc.departUTC,
    arriveUTC: doc.arriveUTC,
    departLocal: doc.departLocal,
    arriveLocal: doc.arriveLocal,
    originTz: doc.originTz,
    destTz: doc.destTz,
    durationMin: doc.durationMin,
    priceNZD: doc.priceNZD,
    seatsLeft: doc.capacity - bookedCount,
    bookedCount,
  };
}
