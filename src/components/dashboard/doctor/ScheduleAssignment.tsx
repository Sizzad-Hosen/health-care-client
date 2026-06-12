"use client";

import { CalendarPlus, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useAssignDoctorSchedulesMutation,
  useGetAvailableSchedulesQuery,
} from "@/redux/features/doctorDashboard/doctorDashboardApi";
import { formatSchedule, totalPages } from "./utils";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Unable to assign schedules.";
}

export function ScheduleAssignment() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const { data, isFetching, isError, refetch } = useGetAvailableSchedulesQuery({
    page,
    limit: 12,
    sortBy: "startDate",
    sortOrder: "asc",
  });
  const [assignSchedules, { isLoading }] = useAssignDoctorSchedulesMutation();
  const schedules = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 12);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const assign = async () => {
    if (selected.length === 0) {
      toast({
        title: "Select schedule slots",
        description: "Choose one or more slots before assigning.",
        variant: "info",
      });
      return;
    }

    try {
      await assignSchedules({ scheduleIds: selected }).unwrap();
      toast({
        title: "Schedules assigned",
        description: `${selected.length} schedule slot(s) assigned to you.`,
        variant: "success",
      });
      setSelected([]);
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">Available schedule slots</p>
            <p className="mt-1 text-sm text-slate-500">
              Select multiple slots and assign them to your doctor calendar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button type="button" disabled={isLoading || selected.length === 0} onClick={assign}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
              Assign selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-red-900">
            <p className="font-semibold">Could not load available schedules</p>
            <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No available unassigned schedule slots found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {schedules.map((schedule) => {
            const isSelected = selected.includes(schedule.id);
            return (
              <button
                key={schedule.id}
                type="button"
                className={`rounded-lg border p-4 text-left text-sm transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => toggle(schedule.id)}
              >
                <span className="block font-semibold">{formatSchedule(schedule)}</span>
                <span className="mt-2 block text-xs opacity-70">ID: {schedule.id}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
          Previous
        </Button>
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>
          Next
        </Button>
      </div>
    </div>
  );
}
