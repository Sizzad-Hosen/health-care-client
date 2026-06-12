"use client";

import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSpecialtiesQuery } from "@/redux/features/public/publicApi";

const fallbackSpecialties = [
  "Cardiology",
  "Medicine",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
];

export function SpecialtyGrid({ limit }: { limit?: number }) {
  const { data, isLoading } = useGetSpecialtiesQuery();
  const specialties = data?.data?.length
    ? data.data.slice(0, limit)
    : fallbackSpecialties.slice(0, limit).map((title) => ({
        id: title.toLowerCase(),
        title,
        icon: undefined,
      }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: limit ?? 6 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-100" />
          ))
        : specialties.map((specialty) => (
            <Link
              key={specialty.id}
              href={`/doctors?specialties=${encodeURIComponent(specialty.title)}`}
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                      {specialty.icon ? (
                        <img src={specialty.icon} alt="" className="h-6 w-6 object-contain" />
                      ) : (
                        <HeartPulse className="h-5 w-5" />
                      )}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{specialty.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Find available doctors</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
    </div>
  );
}
