import { DoctorsDirectory } from "@/components/public/DoctorsDirectory";
import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Doctors",
  description: "Search, filter, compare, and book verified healthcare specialists.",
  path: "/doctors",
});

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <PublicShell>
      <main className="bg-slate-50 py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Doctor search</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
              Find the right doctor
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Filter by name, specialty, gender, and availability signals from the typed API layer.
            </p>
          </div>
          <DoctorsDirectory
            initialSearchParams={{
              searchTerm: typeof params.searchTerm === "string" ? params.searchTerm : "",
              gender: typeof params.gender === "string" ? params.gender : "",
              specialties: typeof params.specialties === "string" ? params.specialties : "",
            }}
          />
        </MotionSection>
      </main>
    </PublicShell>
  );
}
