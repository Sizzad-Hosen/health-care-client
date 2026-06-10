# Health Care Client

A Next.js App Router healthcare dashboard client with authentication, Redux Toolkit state management, RTK Query API calls, and role-based access control for admin, doctor, and patient users.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- Lucide React icons

## Features

- Login page
- Register page
- Forgot password UI
- Mock Next.js API route handlers
- Redux auth state
- RTK Query auth requests
- Access token persistence in `localStorage` for demo use
- Auth restoration after refresh
- Logout flow
- Protected dashboard routes
- Role-based dashboard guards
- Role-based redirect from `/dashboard`
- Unauthorized page
- Responsive healthcare SaaS UI

## Demo Credentials

```text
Admin
email: admin@healthcare.com
password: password123

Doctor
email: doctor@healthcare.com
password: password123

Patient
email: patient@healthcare.com
password: password123
```

## Auth And RBAC Flow

The app currently uses frontend demo auth handlers under `/api/auth/*` for local role switching. Backend data calls use the configured Express API URL from `NEXT_PUBLIC_API_BASE_URL`.

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

Login and register return:

```ts
{
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "doctor" | "patient";
  };
  accessToken: string;
}
```

The frontend stores this demo token and user in `localStorage`, then restores them on app load through `AuthProvider`.

Route behavior:

- Guest users are redirected away from `/dashboard/*` to `/login`.
- Logged-in users are redirected away from `/login` and `/register` to their dashboard.
- `/dashboard` redirects to the current user's role dashboard.
- Admin users can access `/dashboard/admin`.
- Doctor users can access `/dashboard/doctor`.
- Patient users can access `/dashboard/patient`.
- Wrong-role access redirects to `/unauthorized`.

## Project Structure

```text
src/
  app/
    api/auth/
    dashboard/
    forgot-password/
    login/
    register/
    unauthorized/
  components/
    auth/
    dashboard/
    ui/
  lib/
    validations/
    auth.ts
    utils.ts
  redux/
    features/auth/
    provider.tsx
    store.ts
  types/
    auth.ts
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env.local
```

Set the backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

## Backend Integration Status

The frontend has a centralized API client in `src/lib/apiClient.ts`. It reads the backend base URL from `NEXT_PUBLIC_API_BASE_URL` and attaches the persisted access token when available.

Connected frontend services:

```text
src/services/dashboardApi.ts
src/services/taskApi.ts
```

Dashboard integration:

- Admin dashboard loads doctor, patient, and appointment counts from backend APIs where available.
- Doctor and patient dashboards request appointment data from the backend.
- Loading, empty, error, and retry states are handled in `DashboardContent`.

Task integration:

- Task CRUD calls are wired to:

```text
GET    /api/v1/tasks
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

Current backend gap:

- The existing Express backend does not expose `/api/v1/tasks` yet.
- The task page intentionally shows a clear backend endpoint error instead of using mock task data.
- Add a backend task module before expecting task CRUD to succeed end-to-end.

## Notes

This project still uses demo auth and `localStorage` token persistence for frontend role switching. For production, connect auth fully to the Express backend and prefer secure HTTP-only cookies or another hardened session strategy.
