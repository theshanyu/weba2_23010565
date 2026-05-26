import { AIRCRAFT_LABELS } from "./timetable";
import type { Aircraft, SchedulePublic } from "./types";
import { getAirport } from "./airports";

export function formatPrice(nzd: number): string {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 0,
  }).format(nzd);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function airportLabel(icao: string): string {
  const a = getAirport(icao);
  return a ? `${a.city} (${icao})` : icao;
}

export function aircraftLabel(a: Aircraft): string {
  return AIRCRAFT_LABELS[a];
}

export function routeLabel(f: SchedulePublic): string {
  return `${f.origin} → ${f.destination}`;
}
