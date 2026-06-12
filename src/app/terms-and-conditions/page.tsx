import { PublicShell } from "@/components/public/PublicShell";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Terms & Conditions",
  description: "CareFlow terms for appointments, payments, AI guidance, reviews, and platform access.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <section className="mx-auto max-w-4xl px-4 text-slate-700 sm:px-6 lg:px-8 dark:text-slate-300">
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Terms & Conditions</h1>
          {[
            "CareFlow helps patients discover doctors, request appointments, and manage related digital workflows.",
            "Doctor availability, fees, and appointment confirmations may depend on clinic approval and backend schedule data.",
            "AI features provide general guidance and triage direction only. They do not replace professional medical evaluation, diagnosis, or emergency care.",
            "Users agree to provide accurate information, respectful reviews, and lawful use of the platform.",
          ].map((item) => (
            <p key={item} className="mt-5 leading-8">{item}</p>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
