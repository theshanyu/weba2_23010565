"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Printer, XCircle } from "lucide-react";
import Spinner from "@/components/Spinner";
import {
  airportLabel,
  aircraftLabel,
  formatDuration,
  formatPrice,
} from "@/lib/format";
import type { SchedulePublic } from "@/lib/types";

type InvoiceData = {
  booking: {
    ref: string;
    passengerName: string;
    passengerEmail: string;
    passengerPhone?: string;
    bookedAt: string;
  };
  schedule: SchedulePublic;
};

export default function InvoicePage() {
  const { ref } = useParams<{ ref: string }>();
  const router = useRouter();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${ref}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.message ?? "Not found");
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ref]);

  async function cancelBooking() {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${ref}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Cancel failed");
      router.push(
        `/my-bookings?email=${encodeURIComponent(data!.booking.passengerEmail)}&cancelled=1`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <Spinner label="Loading invoice..." />;
  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">{error || "Invoice not found."}</p>
        <Link href="/" className="mt-4 inline-block text-sky-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const { booking, schedule } = data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Booking confirmed</h1>
        <p className="mt-1 text-slate-600">Your booking reference</p>
        <p className="mt-2 font-mono text-3xl font-bold tracking-widest text-sky-700">
          {booking.ref}
        </p>
      </div>

      <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg print:shadow-none">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Tax invoice</h2>
          <p className="text-sm text-slate-500">Dairy Flat Air Ltd</p>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Passenger</dt>
            <dd className="font-medium text-slate-900">{booking.passengerName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-900">{booking.passengerEmail}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Flight</dt>
            <dd className="font-medium text-slate-900">
              {schedule.flightNo} — {schedule.origin} → {schedule.destination}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Aircraft</dt>
            <dd className="text-slate-900">{aircraftLabel(schedule.aircraft)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Departure (local)</dt>
            <dd className="text-right text-slate-900">
              {schedule.departLocal}
              <br />
              <span className="text-xs text-slate-400">
                {airportLabel(schedule.origin)}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Arrival (local)</dt>
            <dd className="text-right text-slate-900">
              {schedule.arriveLocal}
              <br />
              <span className="text-xs text-slate-400">
                {airportLabel(schedule.destination)}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Duration</dt>
            <dd className="text-slate-900">{formatDuration(schedule.durationMin)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-100 pt-4">
            <dt className="font-semibold text-slate-700">Total (NZD)</dt>
            <dd className="text-xl font-bold text-sky-700">
              {formatPrice(schedule.priceNZD)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-400">
          Booked at {new Date(booking.bookedAt).toLocaleString("en-NZ")}
        </p>
      </article>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          Print invoice
        </button>
        <button
          type="button"
          onClick={cancelBooking}
          disabled={cancelling}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          {cancelling ? "Cancelling..." : "Cancel booking"}
        </button>
        <Link
          href={`/my-bookings?email=${encodeURIComponent(booking.passengerEmail)}`}
          className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          View all my bookings
        </Link>
      </div>
    </div>
  );
}
