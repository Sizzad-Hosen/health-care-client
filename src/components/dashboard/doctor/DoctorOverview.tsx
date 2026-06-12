"use client";

import Link from "next/link";
import { CalendarCheck, MessageSquare, RefreshCw, UsersRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useGetDoctorMetaQuery } from "@/redux/features/doctorDashboard/doctorDashboardApi";

const icons = [CalendarCheck, UsersRound, MessageSquare, Wallet];

export function DoctorOverview() {
  const { data, isLoading, isError, refetch } = useGetDoctorMetaQuery();
  const meta = data?.data;
  const metrics = [
    {
      title: "Appointments",
      value: String(meta?.appointmentCount ?? 0),
      helper: "Loaded from /api/v1/meta",
    },
    {
      title: "Patients",
      value: String(meta?.patientCount ?? 0),
      helper: "Unique appointment patients",
    },
    {
      title: "Reviews",
      value: String(meta?.reviewCount ?? 0),
      helper: "Patient feedback count",
    },
    {
      title: "Revenue",
      value: `BDT ${meta?.totalRevenue?._sum?.amount ?? 0}`,
      helper: "Paid appointment revenue",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-5 h-3 w-40 animate-pulse rounded bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col gap-4 p-6 text-red-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Could not load doctor overview</p>
            <p className="mt-1 text-sm">Please retry after checking your session.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            helper={metric.helper}
            icon={icons[index] ?? CalendarCheck}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Appointment status</CardTitle>
        </CardHeader>
        <CardContent>
          {meta?.formattedAppointmentStatusDistribution?.length ? (
            <div className="grid gap-3 md:grid-cols-4">
              {meta.formattedAppointmentStatusDistribution.map((item) => (
                <div key={item.status} className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.status}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No appointment status data yet.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/doctor/appointments">My appointments</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/doctor/schedules">My schedules</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
