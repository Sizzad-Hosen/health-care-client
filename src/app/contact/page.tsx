import { Mail, MapPin, Phone } from "lucide-react";
import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Contact",
  description: "Contact CareFlow for patient support, clinic onboarding, or partnership questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="bg-slate-50 py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Contact</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
              Talk to the CareFlow team
            </h1>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              Get help with appointments, payments, clinic onboarding, and product questions.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-emerald-600" /> +880 1700 000 000</span>
              <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-emerald-600" /> support@careflow.health</span>
              <span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-emerald-600" /> Dhaka, Bangladesh</span>
            </div>
          </div>
          <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Full name" className="dark:border-slate-700 dark:bg-slate-950" />
              <Input placeholder="Email address" type="email" className="dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <Input placeholder="Subject" className="mt-4 dark:border-slate-700 dark:bg-slate-950" />
            <textarea
              rows={6}
              placeholder="How can we help?"
              className="mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <Button type="submit" className="mt-4">Send message</Button>
          </form>
        </MotionSection>
      </main>
    </PublicShell>
  );
}
