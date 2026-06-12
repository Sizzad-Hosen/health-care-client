"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { Clock, MapPin, RefreshCw, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/reviews/RatingStars";
import { useGetDoctorByIdQuery } from "@/redux/features/public/publicApi";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";
import { DoctorScheduleBooking } from "./DoctorScheduleBooking";

function initials(name?: string) {
  return (name ?? "DR")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DoctorDetails({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetDoctorByIdQuery(id);
  const doctor = data?.data;
  const {
    data: reviewsData,
    isError: reviewsError,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetReviewsQuery(
    doctor?.email
      ? {
          doctorEmail: doctor.email,
          limit: 4,
        }
      : skipToken,
  );
  const specialties =
    doctor?.doctorSpecialties
      ?.map((item) => item.specialties?.title)
      .filter(Boolean) ?? [];
  const reviews = reviewsData?.data ?? [];

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (isError || !doctor) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center text-red-900">
          <p className="font-semibold">Doctor profile could not be loaded.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/doctors">Back to doctors</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
                <AvatarFallback>{initials(doctor.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-emerald-700">
                  {doctor.designation ?? "Healthcare specialist"}
                </p>
                <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                  {doctor.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  {doctor.qualification ?? "Qualification available on request"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {specialties.length > 0 ? (
                    specialties.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">General care</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <Clock className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {doctor.experience ?? 0}+ yrs
              </p>
              <p className="text-sm text-slate-500">Experience</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {doctor.appointmentFee ? `BDT ${doctor.appointmentFee}` : "Contact"}
              </p>
              <p className="text-sm text-slate-500">Appointment fee</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 font-semibold text-slate-950">
                {doctor.currentWorkingPlace ?? "Clinic"}
              </p>
              <p className="text-sm text-slate-500">{doctor.address ?? "Location"}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Patient reviews</h2>
            <div className="mt-4 grid gap-4">
              {reviewsLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-md bg-slate-100"
                  />
                ))
              ) : reviewsError ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-900">
                  <p className="font-semibold">Could not load reviews.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => refetchReviews()}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-md border border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                      <RatingStars value={review.rating} />
                      <span className="text-sm font-medium text-slate-500">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {review.comment || "Helpful consultation."}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-950">
                      {review.patient?.name ?? "Verified patient"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  Reviews for this doctor will appear after completed appointments.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-4">
        <DoctorScheduleBooking doctorId={doctor.id} doctorName={doctor.name} />
      </aside>
    </div>
  );
}
