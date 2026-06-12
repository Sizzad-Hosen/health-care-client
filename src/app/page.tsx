import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { AiCarePanel } from "@/components/public/AiCarePanel";
import { FeaturedDoctors } from "@/components/public/FeaturedDoctors";
import { HeroDoctorSearch } from "@/components/public/HeroDoctorSearch";
import { MotionDiv, MotionSection } from "@/components/public/Motion";
import { PatientReviews } from "@/components/public/PatientReviews";
import { PublicShell } from "@/components/public/PublicShell";
import { SpecialtyGrid } from "@/components/public/SpecialtyGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildSeo } from "@/lib/seo";
import { careFeatures, stats } from "@/lib/public-data";

export const metadata = buildSeo({
  title: "Modern Healthcare Website",
  description:
    "Search doctors, book appointments, pay online, read reviews, and use AI-assisted healthcare guidance.",
});

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=80"
            alt="Healthcare team reviewing patient care"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
            <MotionDiv>
              <Badge className="bg-white/15 text-white">AI-powered patient access</Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-normal sm:text-6xl">
                CareFlow
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
                A modern healthcare platform for finding verified doctors, booking
                appointments, paying securely, and getting AI-guided care direction.
              </p>
              <HeroDoctorSearch />
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                {["Verified doctors", "Online payments", "24/7 AI guidance"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </span>
                ))}
              </div>
            </MotionDiv>
            <MotionDiv delay={0.12} className="hidden lg:block">
              <AiCarePanel />
            </MotionDiv>
          </div>
        </section>

        <MotionSection className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="p-5">
                <p className="text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </MotionSection>

        <MotionSection className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Doctors</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                Featured specialists
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/doctors">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedDoctors />
        </MotionSection>

        <MotionSection className="bg-slate-50 py-14 dark:bg-slate-900/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Specialties</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                Browse care by specialty
              </h2>
            </div>
            <SpecialtyGrid limit={6} />
          </div>
        </MotionSection>

        <MotionSection className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Platform</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              Production-ready patient journeys
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              The public website is structured around server-rendered pages, typed
              API boundaries, reusable client islands, loading skeletons, error
              boundaries, and responsive SaaS-style workflows.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {careFeatures.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-700">
                {index % 2 === 0 ? (
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                ) : (
                  <CreditCard className="mt-0.5 h-5 w-5 text-sky-600" />
                )}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </MotionSection>

        <MotionSection className="bg-slate-950 py-14 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Patient voice</p>
              <h2 className="mt-2 text-3xl font-semibold">Trusted care experiences</h2>
              <p className="mt-4 text-slate-300">
                Real reviews help patients evaluate communication, wait time, and follow-up confidence.
              </p>
            </div>
            <PatientReviews />
          </div>
        </MotionSection>
      </main>
    </PublicShell>
  );
}
