"use client";

import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/reviews/RatingStars";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";

export function PatientReviews() {
  const { data, isError, isLoading, refetch } = useGetReviewsQuery({ limit: 3 });
  const reviews = data?.data ?? [];

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col gap-4 p-6 text-red-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Could not load reviews.</p>
            <p className="mt-1 text-sm">Please try again in a moment.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && reviews.length === 0) {
    return (
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6 text-center">
          <p className="font-semibold text-slate-950 dark:text-white">
            No patient reviews yet
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Reviews from completed appointments will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-lg bg-slate-100" />
          ))
        : reviews.map((review) => (
            <Card key={review.id} className="h-full dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <RatingStars value={review.rating} />
                  <span className="text-sm font-medium text-slate-500">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  &ldquo;{review.comment || "Helpful consultation."}&rdquo;
                </p>
                <p className="mt-4 font-semibold text-slate-950 dark:text-white">
                  {review.patient?.name ?? "Verified patient"}
                </p>
                {review.doctor?.name ? (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    For {review.doctor.name}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
