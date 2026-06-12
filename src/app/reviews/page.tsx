import { Star } from "lucide-react";
import { MotionSection } from "@/components/public/Motion";
import { PatientReviews } from "@/components/public/PatientReviews";
import { PublicShell } from "@/components/public/PublicShell";
import { reviewHighlights } from "@/lib/public-data";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Reviews",
  description: "Read verified patient reviews for doctors and healthcare experiences.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Reviews</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
            Patient stories that make choice easier
          </h1>
          <div className="mt-8">
            <PatientReviews />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {reviewHighlights.map((review) => (
              <article key={review.name} className="rounded-lg border border-slate-200 p-5 dark:border-slate-700">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-300">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-4 font-semibold text-slate-950 dark:text-white">{review.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{review.role}</p>
              </article>
            ))}
          </div>
        </MotionSection>
      </main>
    </PublicShell>
  );
}
