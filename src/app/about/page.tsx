import { CheckCircle2 } from "lucide-react";
import { AiCarePanel } from "@/components/public/AiCarePanel";
import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { careFeatures } from "@/lib/public-data";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "About",
  description: "Learn about CareFlow's mission to make healthcare access faster, safer, and clearer.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">About CareFlow</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
              Healthcare access designed around patient confidence
            </h1>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
              CareFlow combines provider discovery, appointment operations, reviews,
              payment readiness, and AI-assisted guidance into one modern SaaS-style
              experience for patients and care teams.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {careFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <AiCarePanel />
        </MotionSection>
      </main>
    </PublicShell>
  );
}
