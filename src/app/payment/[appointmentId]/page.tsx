import { PaymentHandoff } from "@/components/public/PaymentHandoff";
import { PublicShell } from "@/components/public/PublicShell";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Appointment Payment",
  description: "Continue payment for a reserved healthcare appointment.",
  path: "/payment",
});

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;

  return (
    <PublicShell>
      <main className="bg-slate-50 px-4 py-16 dark:bg-slate-950">
        <PaymentHandoff appointmentId={appointmentId} />
      </main>
    </PublicShell>
  );
}
