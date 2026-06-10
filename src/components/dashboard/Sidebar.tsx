"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, CheckSquare, LayoutDashboard, Shield, Stethoscope, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";

const items = [
  {
    href: "/dashboard/admin",
    label: "Admin",
    role: "admin" as UserRole,
    icon: Shield,
  },
  {
    href: "/dashboard/doctor",
    label: "Doctor",
    role: "doctor" as UserRole,
    icon: Stethoscope,
  },
  {
    href: "/dashboard/patient",
    label: "Patient",
    role: "patient" as UserRole,
    icon: UserRound,
  },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">CareFlow</p>
          <p className="text-xs text-slate-500">Clinic dashboard</p>
        </div>
      </div>

      <nav className="space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/tasks"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/tasks"
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-600 hover:bg-slate-50",
          )}
        >
          <CheckSquare className="h-4 w-4" />
          Tasks
        </Link>
        <div className="py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Role Access
        </div>
        {items
          .filter((item) => item.role === role)
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label} dashboard
              </Link>
            );
          })}
      </nav>

      <div className="mt-8 rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
        <CalendarDays className="mb-3 h-5 w-5" />
        Role-based routes keep each workspace focused and protected.
      </div>
    </aside>
  );
}
