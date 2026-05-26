import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import { AIRCRAFT_LABELS } from "@/lib/timetable";

const routes = [
  {
    from: "NZNE",
    to: "YSSY",
    name: "Sydney Prestige",
    freq: "Weekly (Fri / Sun)",
    aircraft: "SJ30i",
  },
  {
    from: "NZNE",
    to: "NZRO",
    name: "Rotorua Shuttle",
    freq: "Weekdays ×2",
    aircraft: "SF50",
  },
  {
    from: "NZNE",
    to: "NZGB",
    name: "Great Barrier",
    freq: "3× weekly",
    aircraft: "SF50",
  },
  {
    from: "NZNE",
    to: "NZCI",
    name: "Chatham Islands",
    freq: "2× weekly",
    aircraft: "HJET",
  },
  {
    from: "NZNE",
    to: "NZTL",
    name: "Lake Tekapo",
    freq: "Weekly",
    aircraft: "HJET",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Point-to-point from Dairy Flat (NZNE)
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Fly regional. Fly refined.
            </h1>
            <p className="mt-4 text-lg text-sky-100">
              Dairy Flat Air connects Auckland&apos;s north with Sydney, Rotorua,
              Great Barrier Island, the Chatham Islands, and Lake Tekapo — on a
              fleet of light jets with luxury seating.
            </p>
          </div>
          <div className="mt-10 -mb-20">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Our routes</h2>
            <p className="mt-1 text-slate-600">
              Infrequent services? Search a wide date range to find the next
              departure.
            </p>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 sm:flex"
          >
            Advanced search <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <div
              key={r.to}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                <div>
                  <h3 className="font-semibold text-slate-900">{r.name}</h3>
                  <p className="text-sm text-slate-500">
                    {r.from} → {r.to}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{r.freq}</p>
                  <p className="mt-1 text-xs font-medium text-sky-600">
                    {AIRCRAFT_LABELS[r.aircraft as keyof typeof AIRCRAFT_LABELS]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Our fleet</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(
              Object.entries(AIRCRAFT_LABELS) as [string, string][]
            ).map(([key, label]) => (
              <div
                key={key}
                className="rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50 p-6 ring-1 ring-slate-200"
              >
                <p className="font-semibold text-slate-900">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
