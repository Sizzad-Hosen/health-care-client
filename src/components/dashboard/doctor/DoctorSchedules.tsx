"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useDeleteDoctorScheduleMutation,
  useGetMyDoctorSchedulesQuery,
} from "@/redux/features/doctorDashboard/doctorDashboardApi";
import { formatSchedule, totalPages } from "./utils";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Unable to remove schedule.";
}

export function DoctorSchedules() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data, isFetching, isError, refetch } = useGetMyDoctorSchedulesQuery({
    page,
    limit: 10,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteDoctorScheduleMutation();
  const schedules = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  const remove = async (scheduleId: string) => {
    if (!window.confirm("Remove this schedule assignment?")) {
      return;
    }

    try {
      await deleteSchedule(scheduleId).unwrap();
      toast({
        title: "Schedule removed",
        description: "The schedule assignment was removed.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Could not remove schedule",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Start date
            <input
              type="date"
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            End date
            <input
              type="date"
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-red-900">
            <p className="font-semibold">Could not load schedules</p>
            <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No assigned schedules found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((item) => (
            <Card key={item.scheduleId}>
              <CardContent className="p-5">
                <p className="font-semibold text-slate-950">
                  {formatSchedule(item.schedule)}
                </p>
                {!item.schedule ? (
                  <p className="mt-1 text-xs text-slate-500">Schedule ID: {item.scheduleId}</p>
                ) : null}
                <p className="mt-2 text-sm text-slate-500">
                  {item.isBooked ? "Booked by a patient" : "Available for booking"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled={isDeleting || item.isBooked}
                  onClick={() => remove(item.scheduleId)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
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
