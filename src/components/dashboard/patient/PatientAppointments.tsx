"use client";

import Link from "next/link";
import { CreditCard, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useGetMyAppointmentsQuery,
  useInitPaymentMutation,
} from "@/redux/features/patientDashboard/patientDashboardApi";
import { formatAppointmentSchedule, statusClass, totalPages } from "./utils";
import { ReviewForm } from "./ReviewForm";

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to start payment.";
}

export function PatientAppointments() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { data, isError, isFetching, refetch } = useGetMyAppointmentsQuery({
    page,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [initPayment, { isLoading: isPaying }] = useInitPaymentMutation();
  const appointments = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 8);

  const payNow = async (appointmentId: string) => {
    try {
      const response = await initPayment(appointmentId).unwrap();
      const paymentUrl = response.data?.paymentUrl;

      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      toast({
        title: "Payment unavailable",
        description: "Payment URL was not returned. Please try again later.",
        variant: "info",
      });
    } catch (error) {
      toast({
        title: "Payment failed",
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
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-64 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-9 w-full animate-pulse rounded bg-slate-100" />
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
        <CardContent className="p-8 text-center">
          <p className="font-semibold text-slate-950">No appointments yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Book a doctor to see appointment status, payment state, and reviews here.
          </p>
          <Button asChild className="mt-5">
            <Link href="/doctors">Find doctors</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {appointments.map((appointment) => {
          const canReview = appointment.status === "COMPLETED";
          const isUnpaid = appointment.paymentStatus === "UNPAID";

          return (
            <Card key={appointment.id}>
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {appointment.doctor?.name ?? "Doctor unavailable"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.doctor?.designation ?? "Healthcare specialist"}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      {formatAppointmentSchedule(appointment)}
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
                <div className="mt-5 flex flex-wrap gap-2">
                  {isUnpaid ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPaying}
                      onClick={() => payNow(appointment.id)}
                    >
                      {isPaying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      Pay Now
                    </Button>
                  ) : null}
                  {canReview ? <ReviewForm appointmentId={appointment.id} /> : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </Button>
        <p className="text-sm text-slate-500">
          Page {page} of {pages}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={page >= pages}
          onClick={() => setPage((current) => Math.min(pages, current + 1))}
        >
          Next
        </Button>
      </div>
    </>
  );
}
