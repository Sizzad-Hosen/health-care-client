"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useGetPatientByIdQuery,
  useSoftDeletePatientMutation,
  useUpdatePatientMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminPatient } from "@/types/admin-dashboard";
import { confirmAction } from "./utils";
import { PatientEditForm, PatientEditModal, patientToForm } from "./AdminEntityModals";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

export function PatientDetailsManagement() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetPatientByIdQuery(id);
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [softDeletePatient, { isLoading: isDeleting }] = useSoftDeletePatientMutation();
  const [editing, setEditing] = useState<AdminPatient | null>(null);
  const [form, setForm] = useState<PatientEditForm | null>(null);
  const patient = data?.data;

  const updateField =
    (field: keyof PatientEditForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => (current ? { ...current, [field]: event.target.value } : current));
    };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !form || !editing.id) return;

    try {
      await updatePatient({
        id: editing.id,
        body: {
          name: form.name,
          contactNumber: form.contactNumber,
          contactNo: form.contactNumber,
          address: form.address,
        },
      }).unwrap();
      toast({ title: "Patient updated", variant: "success" });
      closeEdit();
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const softDelete = async () => {
    if (!patient?.id || !confirmAction(`Soft delete ${patient.name}?`)) return;
    try {
      await softDeletePatient(patient.id).unwrap();
      toast({ title: "Patient soft deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (isError || !patient) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-900">
          <p className="font-semibold">Patient details could not be loaded.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {editing && form ? (
        <PatientEditModal
          form={form}
          isLoading={isUpdating}
          onChange={updateField}
          onClose={closeEdit}
          onSubmit={submitEdit}
        />
      ) : null}
      <div className="mb-5">
        <Button asChild variant="ghost">
          <Link href="/dashboard/admin/patients">
            <ArrowLeft className="h-4 w-4" />
            Back to patients
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-emerald-700">Patient</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{patient.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{patient.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditing(patient); setForm(patientToForm(patient)); }}>
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
              <Button type="button" variant="destructive" disabled={isDeleting} onClick={softDelete}>
                <Trash2 className="h-4 w-4" />
                Soft delete
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Detail label="Contact" value={patient.contactNumber} />
            <Detail label="Gender" value={patient.gender} />
            <Detail label="Address" value={patient.address} />
            <Detail label="Status" value={patient.isDeleted ? "Deleted" : "Active"} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-950">{value ?? "-"}</p>
    </div>
  );
}
