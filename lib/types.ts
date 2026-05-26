import type { ObjectId } from "mongodb";

export type Aircraft = "SJ30i" | "SF50" | "HJET";

export type Booking = {
  ref: string;
  passengerEmail: string;
  passengerName: string;
  passengerPhone?: string;
  bookedAt: Date;
};

export type Schedule = {
  _id?: ObjectId;
  flightNo: string;
  origin: string;
  destination: string;
  aircraft: Aircraft;
  capacity: number;
  departUTC: Date;
  arriveUTC: Date;
  departLocal: string;
  arriveLocal: string;
  originTz: string;
  destTz: string;
  durationMin: number;
  priceNZD: number;
  bookings: Booking[];
};

export type Airport = {
  icao: string;
  name: string;
  city: string;
  timezone: string;
};

export type Passenger = {
  email: string;
  name: string;
  phone?: string;
};

export type SchedulePublic = Omit<Schedule, "_id" | "bookings"> & {
  id: string;
  seatsLeft: number;
  bookedCount: number;
};

export type BookingWithSchedule = {
  ref: string;
  passengerEmail: string;
  passengerName: string;
  passengerPhone?: string;
  bookedAt: string;
  schedule: SchedulePublic;
};
