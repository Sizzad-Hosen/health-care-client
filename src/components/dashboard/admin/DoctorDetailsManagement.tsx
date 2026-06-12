"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useGetDoctorByIdQuery,
  useSoftDeleteDoctorMutation,
  useUpdateDoctorMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminDoctor } from "@/types/admin-dashboard";
import { confirmAction } from "./utils";
import { DoctorEditForm, DoctorEditModal, doctorToForm } from "./AdminEntityModals";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

export function DoctorDetailsManagement() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetDoctorByIdQuery(id);
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [softDeleteDoctor, { isLoading: isDeleting }] = useSoftDeleteDoctorMutation();
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const [form, setForm] = useState<DoctorEditForm | null>(null);
  const doctor = data?.data;

  const updateField =
    (field: keyof DoctorEditForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => (current ? { ...current, [field]: event.target.value } : current));
    };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !form) return;

    try {
      await updateDoctor({
        id: editing.id,
        body: {
          name: form.name,
          contactNumber: form.contactNumber,
          qualification: form.qualification,
          designation: form.designation,
          currentWorkingPlace: form.currentWorkingPlace,
          experience: form.experience ? Number(form.experience) : undefined,
          apointmentFee: form.appointmentFee ? Number(form.appointmentFee) : undefined,
          appointmentFee: form.appointmentFee ? Number(form.appointmentFee) : undefined,
        },
      }).unwrap();
      toast({ title: "Doctor updated", variant: "success" });
      closeEdit();
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const softDelete = async () => {
    if (!doctor || !confirmAction(`Soft delete ${doctor.name}?`)) return;
    try {
      await softDeleteDoctor(doctor.id).unwrap();
      toast({ title: "Doctor soft deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (isError || !doctor) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-900">
          <p className="font-semibold">Doctor details could not be loaded.</p>
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
        <DoctorEditModal
          form={form}
          isLoading={isUpdating}
          onChange={updateField}
          onClose={closeEdit}
          onSubmit={submitEdit}
        />
      ) : null}
      <div className="mb-5">
        <Button asChild variant="ghost">
          <Link href="/dashboard/admin/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to doctors
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-emerald-700">{doctor.designation ?? "Doctor"}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{doctor.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{doctor.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditing(doctor); setForm(doctorToForm(doctor)); }}>
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
            <Detail label="Contact" value={doctor.contactNumber} />
            <Detail label="Gender" value={doctor.gender} />
            <Detail label="Registration" value={doctor.registrationNumber} />
            <Detail label="Experience" value={doctor.experience ? `${doctor.experience} years` : undefined} />
            <Detail label="Fee" value={doctor.appointmentFee ? `BDT ${doctor.appointmentFee}` : undefined} />
            <Detail label="Qualification" value={doctor.qualification} />
            <Detail label="Workplace" value={doctor.currentWorkingPlace} />
            <Detail label="Address" value={doctor.address} />
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
