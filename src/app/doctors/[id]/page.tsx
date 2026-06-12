import { DoctorDetails } from "@/components/public/DoctorDetails";
import { PublicShell } from "@/components/public/PublicShell";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Doctor Details",
  description: "Review doctor credentials, specialties, reviews, fees, and booking details.",
  path: "/doctors",
});

export default async function DoctorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PublicShell>
      <main className="bg-slate-50 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DoctorDetails id={id} />
        </div>
      </main>
    </PublicShell>
  );
}
