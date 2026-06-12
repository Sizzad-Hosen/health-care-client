"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

const mobileSuperAdminLinks = [
  ...mobileAdminLinks,
  { href: "/dashboard/admin/admins", label: "Admin Management" },
];

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const actualRole = useSelector((state: RootState) => state.auth.user?.role);
  const effectiveRole = actualRole ?? role;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar role={effectiveRole} />
        <div className="min-w-0 flex-1">
          <Topbar />
          {effectiveRole === "patient" || effectiveRole === "doctor" || effectiveRole === "admin" || effectiveRole === "super_admin" ? (
            <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
              {(effectiveRole === "patient"
                ? mobilePatientLinks
                : effectiveRole === "doctor"
                  ? mobileDoctorLinks
                  : effectiveRole === "super_admin"
                    ? mobileSuperAdminLinks
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
