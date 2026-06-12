"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { CalendarCheck, Clock, Loader2, LockKeyhole, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useCreateAppointmentMutation,
  useGetAvailableDoctorSchedulesQuery,
} from "@/redux/features/appointment/appointmentApi";
import { useGetDoctorsQuery } from "@/redux/features/public/publicApi";
import { RootState } from "@/redux/store";
import { DoctorSchedule } from "@/types/appointment";

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
    return "Schedule unavailable";
  }

  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Schedule unavailable";
  }

  return `${new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(start)} - ${new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(end)}`;
}

export function PublicAppointmentFlow() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const [doctorId, setDoctorId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const canBook = isInitialized && isAuthenticated && user?.role === "patient";
  const { data: doctorsData, isLoading: isDoctorsLoading } = useGetDoctorsQuery({
    page: 1,
    limit: 50,
  });
  const doctors = doctorsData?.data ?? [];
  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const {
    data: schedulesData,
    isError: isSchedulesError,
    isFetching: isSchedulesFetching,
    refetch,
  } = useGetAvailableDoctorSchedulesQuery(
    canBook && doctorId
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
  const schedules = useMemo(() => schedulesData?.data ?? [], [schedulesData?.data]);
  const selectedSchedule = schedules.find((schedule) => schedule.scheduleId === scheduleId);

  const onBook = async () => {
    if (!doctorId || !selectedSchedule) {
      toast({
        title: "Select doctor and schedule",
        description: "Choose a doctor and available time before booking.",
        variant: "info",
      });
      return;
    }

    const confirmed = window.confirm(
      `Confirm appointment with ${selectedDoctor?.name ?? "this doctor"} at ${formatSchedule(
        selectedSchedule.schedule,
      )}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await createAppointment({
        doctorId,
        scheduleId: selectedSchedule.scheduleId,
      }).unwrap();
      toast({
        title: "Appointment booked",
        description: "Continue to payment to complete your appointment.",
        variant: "success",
      });
      router.push(response.data?.id ? `/payment/${response.data.id}` : "/dashboard/patient");
    } catch (error) {
      toast({
        title: "Booking failed",
        description: getErrorMessage(error),
        variant: "error",
      });
      if (doctorId) {
        void refetch();
      }
    }
  };

  if (!isInitialized) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking booking access...
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6">
          <LockKeyhole className="h-6 w-6 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Login to book an appointment
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Patients must be signed in before reserving a doctor schedule.
          </p>
          <Button asChild className="mt-5">
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
          <h1 className="mt-4 text-2xl font-semibold">Patient account required</h1>
          <p className="mt-2 text-sm leading-6 opacity-80">
            Only patient accounts can book appointments from the public site.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-900">
      <CardContent className="p-6">
        <CalendarCheck className="h-7 w-7 text-emerald-600" />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
          Book a patient appointment
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Choose a doctor, select an available schedule, then confirm your appointment.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="doctor">
              Doctor
            </label>
            <select
              id="doctor"
              className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={doctorId}
              disabled={isDoctorsLoading}
              onChange={(event) => {
                setDoctorId(event.target.value);
                setScheduleId("");
              }}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.designation ? `- ${doctor.designation}` : ""}
                </option>
              ))}
            </select>

            {selectedDoctor ? (
              <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm dark:bg-slate-950">
                <p className="font-semibold text-slate-950 dark:text-white">
                  {selectedDoctor.name}
                </p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {selectedDoctor.qualification ?? selectedDoctor.designation ?? "Doctor"}
                </p>
                <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
                  Fee:{" "}
                  {selectedDoctor.appointmentFee
                    ? `BDT ${selectedDoctor.appointmentFee}`
                    : "Contact clinic"}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Available schedules
            </p>
            {!doctorId ? (
              <div className="mt-2 rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Select a doctor to load available schedules.
              </div>
            ) : isSchedulesFetching ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : isSchedulesError ? (
              <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
                Could not load schedules.
                <Button type="button" variant="outline" className="mt-3" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : schedules.length === 0 ? (
              <div className="mt-2 rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No available schedules for this doctor right now.
              </div>
            ) : (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {schedules.map((schedule) => (
                  <button
                    key={schedule.scheduleId}
                    type="button"
                    className={`rounded-md border p-4 text-left text-sm transition ${
                      scheduleId === schedule.scheduleId
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                    }`}
                    onClick={() => setScheduleId(schedule.scheduleId)}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-emerald-600" />
                        {formatSchedule(schedule.schedule)}
                      </span>
                      <Badge>Available</Badge>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          type="button"
          className="mt-6"
          disabled={!doctorId || !scheduleId || isBooking}
          onClick={onBook}
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm appointment"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
