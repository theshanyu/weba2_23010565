"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { Search } from "lucide-react";
import type { Airport } from "@/lib/types";

type Props = {
  compact?: boolean;
  defaultOrig?: string;
  defaultDest?: string;
  defaultDate1?: string;
  defaultDate2?: string;
};

function defaultDates() {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 30);
  return {
    date1: today.toISOString().slice(0, 10),
    date2: end.toISOString().slice(0, 10),
  };
}

export default function SearchForm({
  compact = false,
  defaultOrig = "NZNE",
  defaultDest = "",
  defaultDate1,
  defaultDate2,
}: Props) {
  const router = useRouter();
  const dates = defaultDates();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [orig, setOrig] = useState(defaultOrig);
  const [dest, setDest] = useState(defaultDest);
  const [date1, setDate1] = useState(defaultDate1 ?? dates.date1);
  const [date2, setDate2] = useState(defaultDate2 ?? dates.date2);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/airports")
      .then((r) => r.json())
      .then(setAirports)
      .catch(() => {});
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!orig || !dest) {
      setError("Please select origin and destination.");
      return;
    }
    if (orig === dest) {
      setError("Origin and destination must differ.");
      return;
    }
    if (date1 > date2) {
      setError("Start date must be before end date.");
      return;
    }
    const q = new URLSearchParams({ orig, dest, date1, date2 });
    router.push(`/search?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-5"}`}>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            From
          </label>
          <select
            value={orig}
            onChange={(e) => setOrig(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {airports.map((a) => (
              <option key={a.icao} value={a.icao}>
                {a.icao} — {a.city}
              </option>
            ))}
            {airports.length === 0 && (
              <>
                <option value="NZNE">NZNE — Dairy Flat</option>
                <option value="YSSY">YSSY — Sydney</option>
                <option value="NZRO">NZRO — Rotorua</option>
                <option value="NZGB">NZGB — Great Barrier</option>
                <option value="NZCI">NZCI — Chatham</option>
                <option value="NZTL">NZTL — Tekapo</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            To
          </label>
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
            required
          >
            <option value="">Select destination</option>
            {airports
              .filter((a) => a.icao !== orig)
              .map((a) => (
                <option key={a.icao} value={a.icao}>
                  {a.icao} — {a.city}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            From date
          </label>
          <input
            type="date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            To date
          </label>
          <input
            type="date"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
