"use client";

import { FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPrescriptionsQuery } from "@/redux/features/adminDashboard/adminDashboardApi";
import { formatDateTime, totalPages } from "./utils";

export function PrescriptionsManagement() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isError, refetch } = useGetPrescriptionsQuery({
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const prescriptions = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-100" />)}
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50"><CardContent className="p-6 text-red-900">Could not load prescriptions.</CardContent></Card>
      ) : prescriptions.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-slate-500">No prescriptions found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">{prescription.doctor?.name ?? prescription.doctorId}</p>
                    <p className="text-sm text-slate-500">{prescription.patient?.name ?? prescription.patientId}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{prescription.instructions}</p>
                <p className="mt-3 text-xs text-slate-500">Created {formatDateTime(prescription.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Next</Button>
      </div>
    </div>
  );
}
