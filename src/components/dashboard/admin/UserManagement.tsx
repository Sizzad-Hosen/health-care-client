"use client";

import Link from "next/link";
import { Stethoscope, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAdminMetaQuery } from "@/redux/features/adminDashboard/adminDashboardApi";

const userSections = [
  {
    href: "/dashboard/admin/doctors",
    title: "Doctors",
    description: "View doctor profiles and details.",
    icon: Stethoscope,
    countKey: "doctorCount",
  },
  {
    href: "/dashboard/admin/patients",
    title: "Patients",
    description: "View patient profiles and details.",
    icon: UsersRound,
    countKey: "patientCount",
  },
] as const;

export function UserManagement() {
  const { data } = useGetAdminMetaQuery();
  const meta = data?.data;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {userSections.map((section) => {
        const Icon = section.icon;
        const count = meta?.[section.countKey] ?? 0;

        return (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
              <CardContent className="flex h-full items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">{count} records</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950">{section.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
