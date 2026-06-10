"use client";

import { CalendarClock, CreditCard, FileText, History } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientDashboardPage() {
  return (
    <RoleGuard allowedRole="patient">
      <DashboardLayout role="patient">
        <div className="mb-6">
          <Badge variant="secondary">Patient workspace</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Personal care overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View appointments, prescriptions, visits, and payment status.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Upcoming appointments"
            value="3"
            helper="Next visit tomorrow"
            icon={CalendarClock}
          />
          <StatCard
            title="Previous visits"
            value="18"
            helper="Across 4 departments"
            icon={History}
          />
          <StatCard
            title="Prescriptions"
            value="5"
            helper="2 active prescriptions"
            icon={FileText}
          />
          <StatCard
            title="Payment status"
            value="Paid"
            helper="No pending invoices"
            icon={CreditCard}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4">
              Confirm tomorrow&apos;s appointment.
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              Review active prescriptions.
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              Download previous visit summary.
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </RoleGuard>
  );
}
