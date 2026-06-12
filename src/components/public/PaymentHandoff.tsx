"use client";

import Link from "next/link";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useInitPaymentMutation } from "@/redux/features/appointment/appointmentApi";

type PaymentHandoffProps = {
  appointmentId: string;
};

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to start payment.";
}

export function PaymentHandoff({ appointmentId }: PaymentHandoffProps) {
  const { toast } = useToast();
  const [initPayment, { isLoading }] = useInitPaymentMutation();
  const [paymentUrl, setPaymentUrl] = useState("");

  const handlePayment = async () => {
    try {
      const response = await initPayment(appointmentId).unwrap();
      const nextUrl = response.data?.paymentUrl;

      if (!nextUrl) {
        toast({
          title: "Appointment created",
          description: "Payment URL is not available yet. You can continue from your appointments.",
          variant: "info",
        });
        return;
      }

      setPaymentUrl(nextUrl);
      window.location.href = nextUrl;
    } catch (error) {
      toast({
        title: "Payment could not start",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-lg dark:border-slate-700 dark:bg-slate-900">
      <CardContent className="p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
          Appointment reserved
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Complete payment to confirm the appointment. If your clinic uses manual
          settlement, you can continue from your patient appointments instead.
        </p>
        <div className="mt-6 grid gap-3">
          <Button type="button" disabled={isLoading} onClick={handlePayment}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Continue to payment
              </>
            )}
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/patient">Go to my appointments</Link>
          </Button>
        </div>
        {paymentUrl ? (
          <p className="mt-4 break-all text-xs text-slate-500 dark:text-slate-400">
            Redirecting to {paymentUrl}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
