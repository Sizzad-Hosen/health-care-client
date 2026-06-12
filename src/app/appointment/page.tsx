import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { PublicAppointmentFlow } from "@/components/public/PublicAppointmentFlow";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Appointment Booking",
  description: "Book appointments with a secure online payment-ready workflow.",
  path: "/appointment",
});

export default function AppointmentPage() {
  return (
    <PublicShell>
      <main className="bg-slate-50 py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PublicAppointmentFlow />
        </MotionSection>
      </main>
    </PublicShell>
  );
}
