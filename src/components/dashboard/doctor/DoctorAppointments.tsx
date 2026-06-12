"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "@/redux/features/doctorDashboard/doctorDashboardApi";
import { DoctorAppointment } from "@/types/doctor-dashboard";
import { formatSchedule, statusClass, totalPages } from "./utils";
import { PrescriptionForm } from "./PrescriptionForm";

const statuses: Array<NonNullable<DoctorAppointment["status"]>> = [
  "SCHEDULED",
  "INPROGRESS",
  "COMPLETED",
  "CANCELED",
];

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Unable to update appointment.";
}

export function DoctorAppointments() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { data, isFetching, isError, refetch } = useGetDoctorAppointmentsQuery({
    page,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();
  const appointments = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 8);

  const changeStatus = async (
    appointmentId: string,
    status: NonNullable<DoctorAppointment["status"]>,
  ) => {
    try {
      await updateStatus({ appointmentId, status }).unwrap();
      toast({
        title: "Appointment updated",
        description: `Status changed to ${status}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Status update failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-72 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-10 w-full animate-pulse rounded bg-slate-100" />
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
            <p className="font-semibold">Could not load appointments</p>
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

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-500">
          No appointments found yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <p className="font-semibold text-slate-950">
                    {appointment.patient?.name ?? "Patient unavailable"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {appointment.patient?.email ?? "Email unavailable"}
                    {appointment.patient?.contactNumber
                      ? ` · ${appointment.patient.contactNumber}`
                      : ""}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {formatSchedule(appointment.schedule)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Badge className={statusClass(appointment.status)}>
                    {appointment.status ?? "UNKNOWN"}
                  </Badge>
                  <Badge className={statusClass(appointment.paymentStatus)}>
                    {appointment.paymentStatus ?? "UNKNOWN"}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={appointment.status ?? "SCHEDULED"}
                  disabled={isUpdating}
                  onChange={(event) =>
                    changeStatus(
                      appointment.id,
                      event.target.value as NonNullable<DoctorAppointment["status"]>,
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : null}
                <PrescriptionForm appointmentId={appointment.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
          Previous
        </Button>
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>
          Next
        </Button>
      </div>
    </>
  );
}
