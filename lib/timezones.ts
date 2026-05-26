import { addMinutes, format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

/** Build UTC Date from local date + HH:mm in a given IANA timezone */
export function localToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string
): Date {
  const iso = `${dateStr}T${timeStr}:00`;
  return fromZonedTime(iso, timezone);
}

/** Format a UTC instant in a timezone for display */
export function formatInTz(
  utc: Date,
  timezone: string,
  pattern = "yyyy-MM-dd HH:mm"
): string {
  const zoned = toZonedTime(utc, timezone);
  return format(zoned, pattern);
}

export function addDuration(utc: Date, minutes: number): Date {
  return addMinutes(utc, minutes);
}

/** Inclusive local calendar-day range at an airport → UTC bounds for MongoDB queries */
export function localDateRangeToUTC(
  date1: string,
  date2: string,
  timezone: string
): { start: Date; end: Date } {
  return {
    start: fromZonedTime(`${date1}T00:00:00`, timezone),
    end: fromZonedTime(`${date2}T23:59:59.999`, timezone),
  };
}
