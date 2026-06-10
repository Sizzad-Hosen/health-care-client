"use client";

import { CalendarCheck, Clock3, Stethoscope, UsersRound } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRole="admin">
      <DashboardLayout role="admin">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary">Admin workspace</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Platform overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage clinic operations, doctors, patients, and appointments.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total doctors"
            value="48"
            helper="12 specialties covered"
            icon={Stethoscope}
          />
          <StatCard
            title="Total patients"
            value="1,284"
            helper="86 new this month"
            icon={UsersRound}
          />
          <StatCard
            title="Total appointments"
            value="3,492"
            helper="Across all departments"
            icon={CalendarCheck}
          />
          <StatCard
            title="Pending appointments"
            value="37"
            helper="Need admin review"
            icon={Clock3}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Operational priorities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4">
              Verify new doctor profile documents.
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              Review pending appointment conflicts.
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              Monitor payment settlement status.
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </RoleGuard>
  );
}
