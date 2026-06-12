import { PublicShell } from "@/components/public/PublicShell";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Privacy Policy",
  description: "CareFlow privacy policy for patient data, payments, reviews, and platform use.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <section className="mx-auto max-w-4xl px-4 text-slate-700 sm:px-6 lg:px-8 dark:text-slate-300">
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Privacy Policy</h1>
          {[
            "CareFlow collects account, appointment, review, and payment-status information needed to operate healthcare workflows.",
            "Medical notes and AI assistant prompts should be treated as sensitive information. Access is limited to authorized workflows and platform support needs.",
            "Payment details are intended to be processed through certified gateway providers. CareFlow stores transaction references, not raw card data.",
            "Patients may request profile correction, export, or deletion where allowed by clinical record and regulatory obligations.",
          ].map((item) => (
            <p key={item} className="mt-5 leading-8">{item}</p>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
