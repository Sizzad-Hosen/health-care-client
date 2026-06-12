"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { CalendarCheck, Clock, Loader2, LockKeyhole, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useCreateAppointmentMutation,
  useGetAvailableDoctorSchedulesQuery,
} from "@/redux/features/appointment/appointmentApi";
import { RootState } from "@/redux/store";
import { DoctorSchedule } from "@/types/appointment";

type DoctorScheduleBookingProps = {
  doctorId: string;
  doctorName: string;
};

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to book appointment.";
}

function formatSchedule(schedule?: DoctorSchedule["schedule"]) {
  if (!schedule) {
    return {
      date: "Schedule date unavailable",
      time: "Time unavailable",
    };
  }

  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return {
      date: "Schedule date unavailable",
      time: "Time unavailable",
    };
  }

  return {
    date: new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(start),
    time: `${new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(start)} - ${new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(end)}`,
  };
}

export function DoctorScheduleBooking({
  doctorId,
  doctorName,
}: DoctorScheduleBookingProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const canLoadSchedules = isInitialized && isAuthenticated && user?.role === "patient";
  const { data, isError, isFetching, refetch } = useGetAvailableDoctorSchedulesQuery(
    canLoadSchedules
      ? {
          doctorId,
          isBooked: false,
          page: 1,
          limit: 20,
        }
      : skipToken,
  );
  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();
  const schedules = useMemo(() => data?.data ?? [], [data?.data]);
  const selectedSchedule = useMemo(
    () => schedules.find((item) => item.scheduleId === selectedScheduleId),
    [schedules, selectedScheduleId],
  );
  const selectedDisplay = formatSchedule(selectedSchedule?.schedule);

  const handleBook = async () => {
    if (!selectedSchedule) {
      toast({
        title: "Choose a schedule first",
        description: "Select an available date and time before confirming.",
        variant: "info",
      });
      return;
    }

    const display = formatSchedule(selectedSchedule.schedule);
    const confirmed = window.confirm(
      `Confirm appointment with ${doctorName} on ${display.date} at ${display.time}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await createAppointment({
        doctorId,
        scheduleId: selectedSchedule.scheduleId,
      }).unwrap();
      const appointmentId = response.data?.id;

      toast({
        title: "Appointment booked",
        description: "Your schedule is reserved. Continue to payment to complete it.",
        variant: "success",
      });

      router.push(appointmentId ? `/payment/${appointmentId}` : "/dashboard/patient");
    } catch (error) {
      toast({
        title: "Booking failed",
        description: getErrorMessage(error),
        variant: "error",
      });
      void refetch();
    }
  };

  if (!isInitialized) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking your booking access...
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6">
          <LockKeyhole className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
            Sign in to book
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Patient authentication is required before appointment schedules can be reserved.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link href="/login">Login as patient</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user.role !== "patient") {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardContent className="p-6 text-amber-950 dark:text-amber-50">
          <ShieldAlert className="h-6 w-6" />
          <h2 className="mt-4 text-xl font-semibold">Patient account required</h2>
          <p className="mt-2 text-sm leading-6 opacity-80">
            Only patients can book appointments. Please switch to a patient account to reserve a schedule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-900">
      <CardContent className="p-6">
        <CalendarCheck className="h-6 w-6 text-emerald-600" />
        <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
          Choose appointment time
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Select one available schedule. We will confirm before sending your booking.
        </p>

        {isFetching ? (
          <div className="mt-5 grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
            Available schedules could not be loaded.
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : schedules.length === 0 ? (
          <div className="mt-5 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No available schedules right now. The doctor may be fully booked.
          </div>
        ) : (
          <div className="mt-5 grid gap-2">
            {schedules.map((item) => {
              const display = formatSchedule(item.schedule);
              const isSelected = selectedScheduleId === item.scheduleId;

              return (
                <button
                  key={item.scheduleId}
                  type="button"
                  disabled={item.isBooked || isBooking}
                  className={`rounded-md border p-3 text-left transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                  onClick={() => setSelectedScheduleId(item.scheduleId)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block font-medium">{display.date}</span>
                      <span className="mt-1 flex items-center gap-2 text-sm opacity-75">
                        <Clock className="h-4 w-4" />
                        {display.time}
                      </span>
                    </span>
                    <Badge variant={item.isBooked ? "outline" : "default"}>
                      {item.isBooked ? "Booked" : "Available"}
                    </Badge>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selectedSchedule ? (
          <div className="mt-5 rounded-md bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Selected schedule
            </p>
            <p className="mt-2 font-semibold text-slate-950 dark:text-white">
              {selectedDisplay.date}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selectedDisplay.time}
            </p>
          </div>
        ) : null}

        <Button
          type="button"
          className="mt-5 w-full"
          disabled={!selectedSchedule || isBooking || isFetching}
          onClick={handleBook}
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm booking"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
