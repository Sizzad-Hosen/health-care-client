"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
};

export function RatingStars({
  value,
  onChange,
  size = "sm",
  disabled = false,
}: RatingStarsProps) {
  const iconClass = size === "md" ? "h-6 w-6" : "h-4 w-4";
  const interactive = Boolean(onChange) && !disabled;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = rating <= Math.round(value);
        const star = (
          <Star
            className={cn(
              iconClass,
              active ? "fill-current text-amber-500" : "text-slate-300",
            )}
            aria-hidden="true"
          />
        );

        if (!interactive) {
          return <span key={rating}>{star}</span>;
        }

        return (
          <button
            key={rating}
            type="button"
            className="rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            onClick={() => onChange?.(rating)}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
