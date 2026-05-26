import Link from "next/link";
import { Clock, Plane, Users } from "lucide-react";
import type { SchedulePublic } from "@/lib/types";
import {
  airportLabel,
  aircraftLabel,
  formatDuration,
  formatPrice,
} from "@/lib/format";

type Props = {
  flight: SchedulePublic;
  showBook?: boolean;
};

export default function FlightCard({ flight, showBook = true }: Props) {
  const full = flight.seatsLeft <= 0;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        full ? "border-slate-200 opacity-75" : "border-slate-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {flight.flightNo}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {airportLabel(flight.origin)} → {airportLabel(flight.destination)}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <Plane className="h-3.5 w-3.5" />
            {aircraftLabel(flight.aircraft)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">
            {formatPrice(flight.priceNZD)}
          </p>
          <p className="text-xs text-slate-500">per passenger</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Departure (local)</p>
          <p className="mt-1 font-medium text-slate-900">{flight.departLocal}</p>
          <p className="text-xs text-slate-400">{flight.originTz}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Arrival (local)</p>
          <p className="mt-1 font-medium text-slate-900">{flight.arriveLocal}</p>
          <p className="text-xs text-slate-400">{flight.destTz}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-sky-500" />
            {formatDuration(flight.durationMin)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-sky-500" />
            {full ? (
              <span className="font-medium text-red-600">Fully booked</span>
            ) : (
              <>
                <span className="font-medium text-emerald-600">
                  {flight.seatsLeft}
                </span>{" "}
                seats left
              </>
            )}
          </span>
        </div>
        {showBook && (
          full ? (
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
              Unavailable
            </span>
          ) : (
            <Link
              href={`/book/${flight.id}`}
              className="rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
            >
              Book now
            </Link>
          )
        )}
      </div>
    </article>
  );
}
