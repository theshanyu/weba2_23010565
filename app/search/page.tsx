"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import Spinner from "@/components/Spinner";
import { ROUTE_HINTS } from "@/lib/timetable";
import type { SchedulePublic } from "@/lib/types";
import { airportLabel } from "@/lib/format";

function SearchResults() {
  const params = useSearchParams();
  const orig = params.get("orig") ?? "NZNE";
  const dest = params.get("dest") ?? "";
  const date1 = params.get("date1") ?? "";
  const date2 = params.get("date2") ?? "";

  const [flights, setFlights] = useState<SchedulePublic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dest || !date1 || !date2) return;
    setLoading(true);
    setError("");
    const q = new URLSearchParams({ orig, dest, date1, date2 });
    fetch(`/api/schedules?${q}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message ?? "Search failed");
        setFlights(data.flights ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orig, dest, date1, date2]);

  const hintKey = `${orig}-${dest}`;
  const hint = ROUTE_HINTS[hintKey];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Search flights</h1>
      <p className="mt-2 text-slate-600">
        Find scheduled departures between two dates. For infrequent routes, try
        a 30-day window.
      </p>

      <div className="mt-6">
        <SearchForm
          compact
          defaultOrig={orig}
          defaultDest={dest}
          defaultDate1={date1}
          defaultDate2={date2}
        />
      </div>

      {hint && (
        <div className="mt-6 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <Info className="h-5 w-5 shrink-0 text-sky-600" />
          <p>{hint}</p>
        </div>
      )}

      {!dest && (
        <p className="mt-8 text-center text-slate-500">
          Select a destination and search to see available flights.
        </p>
      )}

      {loading && <Spinner label="Searching schedules..." />}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && dest && flights.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-medium text-slate-700">No flights found</p>
          <p className="mt-2 text-sm text-slate-500">
            No services from {airportLabel(orig)} to {airportLabel(dest)} between{" "}
            {date1} and {date2}.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Tip: widen your date range — some routes operate only once per week.
          </p>
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-slate-500">
            {flights.length} flight{flights.length !== 1 ? "s" : ""} found
          </p>
          {flights.map((f) => (
            <FlightCard key={f.id} flight={f} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchResults />
    </Suspense>
  );
}
