"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetReviewsQuery } from "@/redux/features/public/publicApi";

const fallbackReviews = [
  {
    id: "fallback-1",
    rating: 5,
    comment: "Booking was simple and the doctor profile helped me choose confidently.",
    patient: { name: "Nusrat A." },
  },
  {
    id: "fallback-2",
    rating: 4.5,
    comment: "I found the right specialist without calling multiple clinics.",
    patient: { name: "Rahim K." },
  },
  {
    id: "fallback-3",
    rating: 5,
    comment: "The dashboard made follow-up care feel organized and clear.",
    patient: { name: "Maliha S." },
  },
];

export function PatientReviews() {
  const { data, isLoading } = useGetReviewsQuery();
  const reviews = data?.data?.length ? data.data.slice(0, 3) : fallbackReviews;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-lg bg-slate-100" />
          ))
        : reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="p-5">
                <div className="mb-4 flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-600">"{review.comment}"</p>
                <p className="mt-4 font-semibold text-slate-950">
                  {review.patient?.name ?? "Verified patient"}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
