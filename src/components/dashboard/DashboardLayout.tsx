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
  { href: "/dashboard/patient", label: "Overview" },
  { href: "/dashboard/patient/appointments", label: "Appointments" },
  { href: "/dashboard/patient/prescriptions", label: "Prescriptions" },
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
          {role === "patient" ? (
            <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
              {mobilePatientLinks.map((item) => (
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
