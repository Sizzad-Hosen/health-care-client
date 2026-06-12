"use client";

import { FormEvent, useState } from "react";
import { FilePlus2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCreatePrescriptionMutation } from "@/redux/features/doctorDashboard/doctorDashboardApi";

type PrescriptionFormProps = {
  appointmentId: string;
};

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Unable to create prescription.";
}

export function PrescriptionForm({ appointmentId }: PrescriptionFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createPrescription({
        appointmentId,
        instructions: instructions.trim(),
      }).unwrap();
      toast({
        title: "Prescription created",
        description: "Prescription instructions were saved.",
        variant: "success",
      });
      setInstructions("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Prescription failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        <FilePlus2 className="h-4 w-4" />
        Prescription
      </Button>
    );
  }

  return (
    <form className="mt-4 rounded-md border border-slate-200 p-4" onSubmit={submit}>
      <textarea
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        rows={4}
        placeholder="Write prescription instructions"
        value={instructions}
        onChange={(event) => setInstructions(event.target.value)}
        required
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={isLoading || !instructions.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />}
          Save prescription
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
