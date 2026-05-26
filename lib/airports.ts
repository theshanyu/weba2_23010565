import type { Airport } from "./types";

export const AIRPORTS: Airport[] = [
  {
    icao: "NZNE",
    name: "Dairy Flat Airport",
    city: "Dairy Flat, Auckland",
    timezone: "Pacific/Auckland",
  },
  {
    icao: "YSSY",
    name: "Sydney Kingsford Smith",
    city: "Sydney, Australia",
    timezone: "Australia/Sydney",
  },
  {
    icao: "NZRO",
    name: "Rotorua Regional",
    city: "Rotorua",
    timezone: "Pacific/Auckland",
  },
  {
    icao: "NZGB",
    name: "Claris Airport",
    city: "Great Barrier Island",
    timezone: "Pacific/Auckland",
  },
  {
    icao: "NZCI",
    name: "Tuuta Airport",
    city: "Chatham Islands",
    timezone: "Pacific/Chatham",
  },
  {
    icao: "NZTL",
    name: "Lake Tekapo",
    city: "Lake Tekapo",
    timezone: "Pacific/Auckland",
  },
];

export function getAirport(icao: string): Airport | undefined {
  return AIRPORTS.find((a) => a.icao === icao);
}
