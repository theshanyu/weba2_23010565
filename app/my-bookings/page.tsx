"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, XCircle } from "lucide-react";
import FlightCard from "@/components/FlightCard";
import Spinner from "@/components/Spinner";
import type { BookingWithSchedule } from "@/lib/types";

function MyBookingsContent() {
  const params = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const cancelled = params.get("cancelled") === "1";

  const [email, setEmail] = useState(initialEmail);
  const [bookings, setBookings] = useState<BookingWithSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(cancelled ? "Booking cancelled successfully." : "");

  async function loadBookings(addr: string) {
    setLoading(true);
    setError("");
    setSuccess(
      cancelled && addr === initialEmail
        ? "Booking cancelled successfully."
        : ""
    );
    try {
      const res = await fetch(
        `/api/passengers/${encodeURIComponent(addr)}/bookings`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to load");
      setBookings(data.bookings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialEmail) loadBookings(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    loadBookings(email.trim());
  }

  async function cancelRef(ref: string) {
    if (!confirm("Cancel this booking?")) return;
    const res = await fetch(`/api/bookings/${ref}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Cancel failed");
      return;
    }
    setSuccess(`Booking ${ref} cancelled.`);
    loadBookings(email.trim());
  }

  const now = Date.now();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">My bookings</h1>
      <p className="mt-2 text-slate-600">
        Enter the email you used when booking — no login required.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Find bookings
        </button>
      </form>

      {success && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading && <Spinner label="Loading your bookings..." />}

      {!loading && email && bookings.length === 0 && !error && (
        <p className="mt-8 text-center text-slate-500">
          No bookings found for this email.
        </p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="mt-8 space-y-6">
          {bookings.map((b) => {
            const depart = new Date(b.schedule.departUTC).getTime();
            const isPast = depart < now;
            return (
              <div
                key={b.ref}
                className={`rounded-2xl border p-4 ${
                  isPast
                    ? "border-slate-200 bg-slate-50 opacity-80"
                    : "border-sky-200 bg-white"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-sky-700">
                      {b.ref}
                    </span>
                    <span className="ml-3 text-sm text-slate-500">
                      {b.passengerName}
                    </span>
                    {!isPast && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Upcoming
                      </span>
                    )}
                    {isPast && (
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        Past
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/invoice/${b.ref}`}
                      className="text-sm font-medium text-sky-600 hover:underline"
                    >
                      View invoice
                    </Link>
                    {!isPast && (
                      <button
                        type="button"
                        onClick={() => cancelRef(b.ref)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                <FlightCard flight={b.schedule} showBook={false} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <MyBookingsContent />
    </Suspense>
  );
}
