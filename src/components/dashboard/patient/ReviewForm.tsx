"use client";

import { FormEvent, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCreateReviewMutation } from "@/redux/features/patientDashboard/patientDashboardApi";

type ReviewFormProps = {
  appointmentId: string;
};

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to submit review.";
}

export function ReviewForm({ appointmentId }: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createReview({
        appointmentId,
        rating,
        comment: comment.trim(),
      }).unwrap();
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your care experience.",
        variant: "success",
      });
      setComment("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Review failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Star className="h-4 w-4" />
        Review
      </Button>
    );
  }

  return (
    <form className="mt-4 rounded-md border border-slate-200 p-4" onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Rating</span>
        {[1, 2, 3, 4, 5].map((item) => (
          <button
            key={item}
            type="button"
            className={item <= rating ? "text-amber-500" : "text-slate-300"}
            aria-label={`${item} star`}
            onClick={() => setRating(item)}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        rows={3}
        placeholder="Write a short review"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        required
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={isLoading || !comment.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit review"
          )}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
