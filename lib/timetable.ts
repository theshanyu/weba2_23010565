import type { Aircraft } from "./types";

/** Weekly flight template — daysOfWeek: 0=Sun … 6=Sat */
export type FlightTemplate = {
  flightNo: string;
  origin: string;
  destination: string;
  aircraft: Aircraft;
  capacity: number;
  daysOfWeek: number[];
  departLocalTime: string; // HH:mm at origin
  durationMin: number;
  priceNZD: number;
  originTz: string;
  destTz: string;
};

export const FLIGHT_TEMPLATES: FlightTemplate[] = [
  // Sydney prestige — SyberJet SJ30i (6)
  {
    flightNo: "DF101",
    origin: "NZNE",
    destination: "YSSY",
    aircraft: "SJ30i",
    capacity: 6,
    daysOfWeek: [5], // Friday mid-morning
    departLocalTime: "10:30",
    durationMin: 195, // westbound longer
    priceNZD: 2890,
    originTz: "Pacific/Auckland",
    destTz: "Australia/Sydney",
  },
  {
    flightNo: "DF102",
    origin: "YSSY",
    destination: "NZNE",
    aircraft: "SJ30i",
    capacity: 6,
    daysOfWeek: [0], // Sunday mid-afternoon Sydney time
    departLocalTime: "14:30",
    durationMin: 165,
    priceNZD: 2890,
    originTz: "Australia/Sydney",
    destTz: "Pacific/Auckland",
  },
  // Rotorua shuttle — Cirrus SF50 (4), Mon–Fri twice daily
  {
    flightNo: "DF201",
    origin: "NZNE",
    destination: "NZRO",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [1, 2, 3, 4, 5],
    departLocalTime: "07:00",
    durationMin: 55,
    priceNZD: 420,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  {
    flightNo: "DF202",
    origin: "NZRO",
    destination: "NZNE",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [1, 2, 3, 4, 5],
    departLocalTime: "08:15",
    durationMin: 55,
    priceNZD: 420,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  {
    flightNo: "DF203",
    origin: "NZNE",
    destination: "NZRO",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [1, 2, 3, 4, 5],
    departLocalTime: "17:00",
    durationMin: 55,
    priceNZD: 450,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  {
    flightNo: "DF204",
    origin: "NZRO",
    destination: "NZNE",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [1, 2, 3, 4, 5],
    departLocalTime: "18:30",
    durationMin: 55,
    priceNZD: 450,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  // Great Barrier Island — Cirrus SF50 (4)
  {
    flightNo: "DF301",
    origin: "NZNE",
    destination: "NZGB",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri morning
    departLocalTime: "09:00",
    durationMin: 50,
    priceNZD: 380,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  {
    flightNo: "DF302",
    origin: "NZGB",
    destination: "NZNE",
    aircraft: "SF50",
    capacity: 4,
    daysOfWeek: [2, 4, 6], // Tue, Thu, Sat morning
    departLocalTime: "09:30",
    durationMin: 50,
    priceNZD: 380,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  // Chatham Islands — HondaJet Elite (5)
  {
    flightNo: "DF401",
    origin: "NZNE",
    destination: "NZCI",
    aircraft: "HJET",
    capacity: 5,
    daysOfWeek: [2, 5], // Tue, Fri
    departLocalTime: "08:30",
    durationMin: 115,
    priceNZD: 1250,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Chatham",
  },
  {
    flightNo: "DF402",
    origin: "NZCI",
    destination: "NZNE",
    aircraft: "HJET",
    capacity: 5,
    daysOfWeek: [3, 6], // Wed, Sat
    departLocalTime: "10:00",
    durationMin: 110,
    priceNZD: 1250,
    originTz: "Pacific/Chatham",
    destTz: "Pacific/Auckland",
  },
  // Lake Tekapo — HondaJet Elite (5)
  {
    flightNo: "DF501",
    origin: "NZNE",
    destination: "NZTL",
    aircraft: "HJET",
    capacity: 5,
    daysOfWeek: [1], // Monday
    departLocalTime: "09:30",
    durationMin: 130, // westbound
    priceNZD: 980,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
  {
    flightNo: "DF502",
    origin: "NZTL",
    destination: "NZNE",
    aircraft: "HJET",
    capacity: 5,
    daysOfWeek: [2], // Tuesday
    departLocalTime: "11:00",
    durationMin: 115, // eastbound
    priceNZD: 980,
    originTz: "Pacific/Auckland",
    destTz: "Pacific/Auckland",
  },
];

export const ROUTE_HINTS: Record<string, string> = {
  "NZNE-YSSY": "Prestige service: departs Dairy Flat every Friday; returns from Sydney every Sunday.",
  "NZNE-NZRO": "Weekday shuttle: early morning and late afternoon departures Monday–Friday.",
  "NZNE-NZGB": "Three times weekly: Mon/Wed/Fri outbound; Tue/Thu/Sat return from Great Barrier.",
  "NZNE-NZCI": "Twice weekly: Tue/Fri outbound; Wed/Sat return from Chatham Islands.",
  "NZNE-NZTL": "Weekly: Monday outbound from Dairy Flat; Tuesday return from Tekapo.",
};

export const AIRCRAFT_LABELS: Record<Aircraft, string> = {
  SJ30i: "SyberJet SJ30i (6 seats)",
  SF50: "Cirrus SF50 (4 seats)",
  HJET: "HondaJet Elite (5 seats)",
};
