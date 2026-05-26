"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FlightCard from "@/components/FlightCard";
import Spinner from "@/components/Spinner";
import type { SchedulePublic } from "@/lib/types";

export default function BookPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const router = useRouter();
  const [flight, setFlight] = useState<SchedulePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/schedules/${scheduleId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message ?? "Not found");
        setFlight(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [scheduleId]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      scheduleId,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Booking failed");
      router.push(`/invoice/${data.ref}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner label="Loading flight..." />;
  if (!flight) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">{error || "Flight not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Complete your booking</h1>
      <p className="mt-2 text-slate-600">
        Enter passenger details. You will receive a unique booking reference.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <FlightCard flight={flight} showBook={false} />
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Passenger details</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full name *
              </label>
              <input
                name="name"
                required
                minLength={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="jane@example.com"
              />
              <p className="mt-1 text-xs text-slate-500">
                Used to look up your bookings — no account required.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone (optional)
              </label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="+64 21 000 0000"
              />
            </div>
          </div>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || flight.seatsLeft <= 0}
            className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
