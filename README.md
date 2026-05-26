# Dairy Flat Air — Online Booking System

**159.352 Assignment 2** — Student ID: **23010565**

A Next.js web application for booking flights on a fictitious regional airline operating from Dairy Flat Airport (NZNE). Built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB Atlas.

## Live deployment

**https://weba2-23010565.vercel.app**

GitHub: https://github.com/theshanyu/weba2_23010565

## Features

- Landing page with route overview and flight search
- Search scheduled flights by origin, destination, and date range
- Book a seat (unique 6-character booking reference)
- View invoice with flight details, price, and local times
- Cancel a booking
- Look up all bookings by passenger email (no login required)
- Atomic overbooking prevention
- 60 days of seeded schedules (rolling weekly timetable)

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Vercel](https://vercel.com/) deployment
- Tailwind CSS, Zod, date-fns-tz

## Quick start (local)

### 1. MongoDB Atlas setup

1. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
2. Create an **M0** cluster.
3. **Database Access** → add a database user (username + password).
4. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere, required for Vercel).
5. **Connect** → Drivers → copy the connection string.

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dairyflat?retryWrites=true&w=majority
```

### 3. Install and seed

```bash
npm install
npm run seed
```

You should see hundreds of schedule documents inserted.

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo search examples

| Route | Origin | Dest | Tip |
|-------|--------|------|-----|
| Sydney prestige | NZNE | YSSY | Search a range that includes a **Friday** |
| Rotorua shuttle | NZNE | NZRO | Weekdays only; try Mon–Fri, 7–30 day window |
| Great Barrier | NZNE | NZGB | Mon / Wed / Fri mornings |
| Chatham Islands | NZNE | NZCI | Tue or Fri departures |
| Lake Tekapo | NZNE | NZTL | **Monday** departures |

Example URL:

```
/search?orig=NZNE&dest=YSSY&date1=2026-05-30&date2=2026-07-30
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/airports` | List airports |
| GET | `/api/schedules?date1=&date2=&orig=&dest=` | Search flights |
| GET | `/api/schedules/:id` | Flight details |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:ref` | Invoice data |
| DELETE | `/api/bookings/:ref` | Cancel booking |
| GET | `/api/passengers/:email/bookings` | All bookings for email |

## Deploy to Vercel

1. Push this repo to GitHub (e.g. `a2_23010565`).
2. Log in to [Vercel](https://vercel.com/) → **Add New Project** → import the repo.
3. Add environment variable: `MONGODB_URI` = your Atlas connection string.
4. Deploy.
5. On your machine, run `npm run seed` again (uses `.env.local` pointing at Atlas) so production has flight data.

## Project structure

```
app/           # Pages and API routes
components/    # UI components
lib/           # DB, timetable, types, helpers
scripts/       # seed.ts — populate MongoDB
docs/          # Assignment PDFs
```

## Fleet & routes

- **SyberJet SJ30i** (6 seats) — NZNE ↔ YSSY (weekly prestige)
- **Cirrus SF50** (4 seats) — NZNE ↔ NZRO (weekday shuttle), NZNE ↔ NZGB
- **HondaJet Elite** (5 seats) — NZNE ↔ NZCI, NZNE ↔ NZTL

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run seed` | Seed airports + 60 days of schedules |
| `npm run lint` | ESLint |

## Author

Theshan — 23010565 — 159.352 Advanced Web Development
