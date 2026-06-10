"use client";

import { AlertCircle, CalendarCheck, Clock3, FileText, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import { RootState } from "@/redux/store";

const icons = [CalendarCheck, Clock3, FileText, RefreshCw];

export function DashboardContent() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, error, isEmpty, isError, isLoading, refresh } = useDashboard(user);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Card key={item}>
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
        <CardContent className="flex flex-col items-start gap-4 p-6 text-red-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">Could not load dashboard data</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void refresh()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty || !data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-500">
          No dashboard data is available from the backend yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
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
          <CardTitle>Backend-driven next steps</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          {data.priorities.map((item) => (
            <div key={item} className="rounded-md bg-slate-50 p-4">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
