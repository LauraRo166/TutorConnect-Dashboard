# TutorConnect Dashboard

Admin KPI dashboard for the TutorConnect platform. Provides real-time business metrics — sessions, revenue, NPS, and user growth — with date range filtering and role-based access control.

## Screenshots

### Overview — KPIs & Activity Charts

<img width="2797" height="1460" alt="Captura de pantalla 2026-05-06 234245" src="https://github.com/user-attachments/assets/c89973ee-6f4f-4369-a984-1cbd9fa3e684" />

### Satisfaction, Top Tutors & Session Status

<img width="2815" height="1466" alt="Captura de pantalla 2026-05-06 234316" src="https://github.com/user-attachments/assets/3bc6c5cf-2265-49a7-ab28-65273e5fad7a" />

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Clerk (`@clerk/nextjs`) |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios |
| Charts | Recharts v3 |
| UI components | shadcn/ui |

---

## Prerequisites

- Node.js 20+
- [TutorConnect-Backend](https://github.com/IETI-TutorConnect/TutorConnect-Backend) running on `http://localhost:3000`
- PostgreSQL with the backend schema initialized
- A Clerk application (same one used by the backend)

---

## Environment Setup

Create a `.env.local` file at the project root:

```env
# Clerk — same app as the backend
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/login

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

> The dashboard runs on port **3001** to avoid conflicts with the backend on 3000. Set the port with:
> ```bash
> PORT=3001 npm run dev
> ```

---

## Admin Access Setup

The dashboard is restricted to users with the `ADMIN` role. To grant access to your account:

**1. Sign in to the dashboard** with your Google or Clerk account and note the Clerk user ID from the Clerk Dashboard (format: `user_XXXXXXXXXXXXXXXXXXXX`).

**2. Register the user in the database** with the `ADMIN` role:

```sql
INSERT INTO "user" (clerk_id, email, first_name, last_name, role, status)
VALUES (
  'user_XXXXXXXXXXXXXXXXXXXX',
  'your@email.com',
  'First',
  'Last',
  'ADMIN',
  'ACTIVE'
);
```

If the user already exists (created via webhook) just update the role:

```sql
UPDATE "user"
SET role = 'ADMIN'
WHERE clerk_id = 'user_XXXXXXXXXXXXXXXXXXXX';
```

**3. Sign in again** — the dashboard will now grant access.

---

## Loading Demo Data

A seed script is included to populate the database with 30 days of realistic data (5 tutors, 25 learners, 150 sessions, payments, and reviews).

### Run via Docker (recommended)

```bash
# Copy the file into the container
docker cp seed_dashboard.sql <your-postgres-container>:/tmp/seed.sql

# Execute it
docker exec <your-postgres-container> psql -U postgres -d tutorconnect -f /tmp/seed.sql
```

Replace `<your-postgres-container>` with your actual container name (e.g. `tutorconnect-postgres-dev`).

### Run via Node.js (alternative — no psql required)

```bash
node -e "
const { spawnSync } = require('child_process');
const fs = require('fs');
const sql = fs.readFileSync('seed_dashboard.sql', 'utf8');
const res = spawnSync('docker', ['exec', '-i', '<your-postgres-container>', 'psql', '-U', 'postgres', '-d', 'tutorconnect'], {
  input: sql, encoding: 'utf8', timeout: 60000
});
console.log(res.stdout);
console.log(res.stderr);
"
```

The seed inserts:

| Table | Records |
|---|---|
| `user` (TUTOR role) | 5 |
| `tutors` | 5 |
| `user` (LEARNER role) | 25 |
| `bookings` | ~150 (trending upward over 30 days) |
| `payment` | ~128 (COMPLETED) |
| `review` | ~98 (avg rating 4.1 ★) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # ClerkProvider + ReactQueryProvider
│   ├── page.tsx                    # Redirects based on auth state
│   ├── (auth)/login/               # Clerk SignIn component
│   └── (admin)/
│       ├── layout.tsx              # Role verification (server component)
│       └── dashboard/page.tsx      # Main dashboard page
├── components/
│   ├── layout/                     # AdminSidebar, AdminTopBar
│   └── dashboard/                  # KpiCard, charts, table, date picker
└── lib/
    ├── api/                        # Axios instance + admin endpoints
    ├── hooks/                      # useAdminMetrics (React Query)
    ├── types/                      # TypeScript interfaces
    └── utils/                      # Currency and date formatters
```

---

## Backend Dependency

This dashboard consumes `GET /api/admin/metrics` from TutorConnect-Backend. The endpoint requires:

- A valid Clerk JWT in the `Authorization: Bearer <token>` header
- The authenticated user to have `role = 'ADMIN'` in the database

See the backend PR `feature/admin-dashboard-metrics` for the implementation details.
