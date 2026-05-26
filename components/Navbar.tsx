import Link from "next/link";
import { Plane } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-200">
            <Plane className="h-5 w-5" />
          </span>
          <span>
            Dairy Flat <span className="text-sky-600">Air</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Search flights
          </Link>
          <Link
            href="/my-bookings"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            My bookings
          </Link>
        </nav>
      </div>
    </header>
  );
}
