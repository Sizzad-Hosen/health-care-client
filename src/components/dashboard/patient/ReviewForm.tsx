"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { RatingStars } from "@/components/reviews/RatingStars";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";

type ReviewFormProps = {
  appointmentId: string;
  existingReview?: {
    id: string;
    rating?: number;
    comment?: string | null;
  } | null;
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

export function ReviewForm({ appointmentId, existingReview }: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const trimmedComment = comment.trim();
  const commentInvalid = trimmedComment.length > 0 && trimmedComment.length < 3;
  const canSubmit = rating > 0 && !commentInvalid && !isLoading;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (rating <= 0) {
        toast({
          title: "Rating required",
          description: "Select a rating before submitting your review.",
          variant: "error",
        });
        return;
      }

      if (commentInvalid) {
        toast({
          title: "Comment is too short",
          description: "Use at least 3 characters or leave the comment empty.",
          variant: "error",
        });
        return;
      }

      await createReview({
        appointmentId,
        rating,
        comment: trimmedComment,
      }).unwrap();
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your care experience.",
        variant: "success",
      });
      setRating(0);
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

  if (existingReview) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
        <CheckCircle2 className="h-4 w-4" />
        Reviewed
      </div>
    );
  }

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
        <RatingStars value={rating} onChange={setRating} size="md" />
      </div>
      <textarea
        className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        rows={3}
        placeholder="Write a short review (optional)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      {commentInvalid ? (
        <p className="mt-2 text-xs font-medium text-red-600">
          Comment must be at least 3 characters or empty.
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={!canSubmit}>
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
