"use client";

import { FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMyPrescriptionsQuery } from "@/redux/features/patientDashboard/patientDashboardApi";
import { formatDateTime, totalPages } from "./utils";

export function PatientPrescriptions() {
  const [page, setPage] = useState(1);
  const { data, isError, isFetching, refetch } = useGetMyPrescriptionsQuery({
    page,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const prescriptions = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 8);

  if (isFetching) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-20 animate-pulse rounded bg-slate-100" />
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
            <p className="font-semibold">Could not load prescriptions</p>
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

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-4 font-semibold text-slate-950">No prescriptions yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Completed consultations with prescriptions will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {prescription.doctor?.name ?? "Doctor unavailable"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Created {formatDateTime(prescription.createdAt)}
                  </p>
                </div>
              </div>
              <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {prescription.instructions}
              </p>
              {prescription.followUpDate ? (
                <p className="mt-3 text-sm font-medium text-emerald-700">
                  Follow-up: {formatDateTime(prescription.followUpDate)}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
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
