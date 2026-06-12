import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { SpecialtyGrid } from "@/components/public/SpecialtyGrid";
import { buildSeo } from "@/lib/seo";
import { specialties } from "@/lib/public-data";

export const metadata = buildSeo({
  title: "Specialties",
  description: "Browse healthcare specialties and find available doctors by care need.",
  path: "/specialties",
});

export default function SpecialtiesPage() {
  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Specialties</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
            Care categories for every patient journey
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Start from a specialty, then narrow by profile, reviews, and appointment fee.
          </p>
          <div className="mt-8">
            <SpecialtyGrid />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {specialties.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-slate-200 p-5 dark:border-slate-700">
                  <Icon className="h-6 w-6 text-emerald-600" />
                  <h2 className="mt-4 font-semibold text-slate-950 dark:text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                </div>
              );
            })}
          </div>
        </MotionSection>
      </main>
    </PublicShell>
  );
}
