"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetDoctorByIdQuery,
} from "@/redux/features/adminDashboard/adminDashboardApi";

export function DoctorDetailsManagement() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useGetDoctorByIdQuery(id);
  const doctor = data?.data;

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (isError || !doctor) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-900">
          <p className="font-semibold">Doctor details could not be loaded.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-5">
        <Button asChild variant="ghost">
          <Link href="/dashboard/admin/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to doctors
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-emerald-700">{doctor.designation ?? "Doctor"}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{doctor.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{doctor.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Detail label="Contact" value={doctor.contactNumber} />
            <Detail label="Gender" value={doctor.gender} />
            <Detail label="Registration" value={doctor.registrationNumber} />
            <Detail label="Experience" value={doctor.experience ? `${doctor.experience} years` : undefined} />
            <Detail label="Fee" value={doctor.appointmentFee ? `BDT ${doctor.appointmentFee}` : undefined} />
            <Detail label="Qualification" value={doctor.qualification} />
            <Detail label="Workplace" value={doctor.currentWorkingPlace} />
            <Detail label="Address" value={doctor.address} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-950">{value ?? "-"}</p>
    </div>
  );
}
