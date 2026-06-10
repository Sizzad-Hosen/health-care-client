"use client";

import { ClipboardList, FilePenLine, HeartPulse, UsersRound } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorDashboardPage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6">
          <Badge variant="secondary">Doctor workspace</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Clinical schedule
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track appointments, patients, and prescription tasks.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's appointments"
            value="12"
            helper="4 video consultations"
            icon={ClipboardList}
          />
          <StatCard
            title="Total patients"
            value="328"
            helper="Active assigned patients"
            icon={UsersRound}
          />
          <StatCard
            title="Pending prescriptions"
            value="7"
            helper="Awaiting completion"
            icon={FilePenLine}
          />
          <StatCard
            title="Profile completion"
            value="92%"
            helper="Add availability notes"
            icon={HeartPulse}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Today&apos;s care queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {["09:30 AM - Follow-up consultation", "11:00 AM - New patient review", "02:30 PM - Prescription update"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4"
              >
                <span className="text-slate-700">{item}</span>
                <Badge>Scheduled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardLayout>
    </RoleGuard>
  );
}
