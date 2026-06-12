"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";

const mobilePatientLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/patient/appointments", label: "Appointments" },
  { href: "/dashboard/patient/prescriptions", label: "Prescriptions" },
];

const mobileDoctorLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/doctor/appointments", label: "Appointments" },
  { href: "/dashboard/doctor/schedules", label: "Schedules" },
];

const mobileAdminLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/admin/users", label: "User Management" },
  { href: "/dashboard/admin/doctors", label: "Doctors" },
  { href: "/dashboard/admin/patients", label: "Patients" },
  { href: "/dashboard/admin/appointments", label: "Appointments" },
  { href: "/dashboard/admin/specialties", label: "Specialties" },
  { href: "/dashboard/admin/schedules", label: "Schedules" },
  { href: "/dashboard/admin/prescriptions", label: "Prescriptions" },
];

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar role={role} />
        <div className="min-w-0 flex-1">
          <Topbar />
          {role === "patient" || role === "doctor" || role === "admin" || role === "super_admin" ? (
            <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
              {(role === "patient"
                ? mobilePatientLinks
                : role === "doctor"
                  ? mobileDoctorLinks
                  : mobileAdminLinks
              ).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
