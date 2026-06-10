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

The app uses mock API handlers under `/api/auth/*`.

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

## Notes

This project intentionally uses mock API routes and `localStorage` token persistence because it is a frontend demo. For production, replace the mock handlers with a real backend and prefer secure HTTP-only cookies or another hardened session strategy.
