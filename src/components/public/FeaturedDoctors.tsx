"use client";

import { DoctorCard } from "./DoctorCard";
import { useGetDoctorsQuery } from "@/redux/features/public/publicApi";

export function FeaturedDoctors() {
  const { data, isLoading, isError } = useGetDoctorsQuery({ page: 1, limit: 3 });
  const doctors = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError || doctors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        Featured doctors will appear here once doctor profiles are available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
