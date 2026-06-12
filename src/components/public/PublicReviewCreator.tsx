"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { MessageSquare, ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMyAppointmentsQuery } from "@/redux/features/patientDashboard/patientDashboardApi";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";
import { RootState } from "@/redux/store";
import { ReviewForm } from "@/components/dashboard/patient/ReviewForm";
import { formatAppointmentSchedule } from "@/components/dashboard/patient/utils";

export function PublicReviewCreator() {
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const canReview = isInitialized && isAuthenticated && user?.role === "patient";
  const { data, isFetching, isError } = useGetMyAppointmentsQuery(
    canReview
      ? {
          page: 1,
          limit: 6,
          status: "COMPLETED",
        }
      : skipToken,
  );
  const { data: reviewsData } = useGetReviewsQuery(
    canReview && user?.email
      ? {
          patientEmail: user.email,
          limit: 100,
        }
      : skipToken,
  );
  const appointments = data?.data ?? [];
  const reviewedAppointments = new Map(
    (reviewsData?.data ?? [])
      .filter((review) => review.appointmentId)
      .map((review) => [review.appointmentId as string, review]),
  );

  if (!isInitialized) {
    return <div className="h-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
            Add your review
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Login as a patient to review completed appointments.
          </p>
          <Button asChild className="mt-5">
            <Link href="/login">Login to review</Link>
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
            Only patients can add appointment reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isFetching) {
    return <div className="h-40 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />;
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-900">
          <p className="font-semibold">Could not load completed appointments.</p>
          <p className="mt-1 text-sm">Please try again from your dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
            No completed appointments to review
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            After a completed visit, you can add a review here or from your dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-900">
      <CardContent className="p-6">
        <MessageSquare className="h-6 w-6 text-emerald-600" />
        <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
          Review a completed appointment
        </h2>
        <div className="mt-5 grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
              <p className="font-semibold text-slate-950 dark:text-white">
                {appointment.doctor?.name ?? "Doctor unavailable"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formatAppointmentSchedule(appointment)}
              </p>
              <ReviewForm
                appointmentId={appointment.id}
                existingReview={
                  appointment.review ?? reviewedAppointments.get(appointment.id) ?? null
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
