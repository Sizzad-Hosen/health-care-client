"use client";

import Link from "next/link";
import { CalendarCheck, Stethoscope, UsersRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useGetAdminMetaQuery } from "@/redux/features/adminDashboard/adminDashboardApi";

const icons = [Stethoscope, UsersRound, CalendarCheck, Wallet];

export function AdminOverview() {
  const { data, isLoading, isError, refetch } = useGetAdminMetaQuery();
  const meta = data?.data;
  const metrics = [
    {
      title: "Doctors",
      value: String(meta?.doctorCount ?? 0),
      helper: "Total doctor profiles",
    },
    {
      title: "Patients",
      value: String(meta?.patientCount ?? 0),
      helper: "Total patient profiles",
    },
    {
      title: "Appointments",
      value: String(meta?.appointmentCount ?? 0),
      helper: "All platform appointments",
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
        <CardContent className="p-6 text-red-900">
          <p className="font-semibold">Could not load admin overview</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
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
          <CardTitle>Platform status</CardTitle>
        </CardHeader>
        <CardContent>
          {meta?.pieCharData?.length ? (
            <div className="grid gap-3 md:grid-cols-4">
              {meta.pieCharData.map((item) => (
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
              No appointment distribution data yet.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/admin/doctors">Manage doctors</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/schedules">Manage schedules</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
