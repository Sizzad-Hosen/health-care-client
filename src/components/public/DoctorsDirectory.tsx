"use client";

import { FormEvent, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorCard } from "./DoctorCard";
import {
  useGetDoctorsQuery,
  useGetSpecialtiesQuery,
} from "@/redux/features/public/publicApi";

type Filters = {
  searchTerm: string;
  gender: string;
  specialties: string;
};

const initialFilters: Filters = {
  searchTerm: "",
  gender: "",
  specialties: "",
};

export function DoctorsDirectory() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [draft, setDraft] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetDoctorsQuery({
    ...filters,
    page,
    limit: 9,
  });
  const { data: specialties } = useGetSpecialtiesQuery();
  const doctors = data?.data ?? [];
  const total = data?.meta?.total ?? doctors.length;
  const limit = data?.meta?.limit ?? 9;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setFilters(draft);
  };

  const reset = () => {
    setDraft(initialFilters);
    setFilters(initialFilters);
    setPage(1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <p className="font-semibold text-slate-950">Find doctors</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="doctor-search">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="doctor-search"
                className="pl-9"
                placeholder="Name, email, qualification"
                value={draft.searchTerm}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    searchTerm: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="specialty">
              Specialty
            </label>
            <select
              id="specialty"
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={draft.specialties}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  specialties: event.target.value,
                }))
              }
            >
              <option value="">All specialties</option>
              {specialties?.data?.map((specialty) => (
                <option key={specialty.id} value={specialty.title}>
                  {specialty.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={draft.gender}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  gender: event.target.value,
                }))
              }
            >
              <option value="">Any gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="submit">Apply</Button>
            <Button type="button" variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </form>
      </aside>

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {total} doctors found
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              Available specialists
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : isError || doctors.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-950">No doctors found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try changing search terms, specialty, or gender filter.
            </p>
            <Button type="button" variant="outline" className="mt-5" onClick={reset}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
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
                Page {page} of {totalPages}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
