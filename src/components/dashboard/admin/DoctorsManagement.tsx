"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useGetDoctorsQuery,
  useSoftDeleteDoctorMutation,
  useUpdateDoctorMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminDoctor } from "@/types/admin-dashboard";
import { confirmAction, totalPages } from "./utils";
import { DoctorEditForm, DoctorEditModal, doctorToForm } from "./AdminEntityModals";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

export function DoctorsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const [form, setForm] = useState<DoctorEditForm | null>(null);
  const { data, isFetching, isError, refetch } = useGetDoctorsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    gender: gender || undefined,
  });
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [softDeleteDoctor, { isLoading: isDeleting }] = useSoftDeleteDoctorMutation();
  const doctors = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  const updateField =
    (field: keyof DoctorEditForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => (current ? { ...current, [field]: event.target.value } : current));
    };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editing || !form) {
      return;
    }

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
      toast({
        title: "Update failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  const openEdit = (doctor: AdminDoctor) => {
    setEditing(doctor);
    setForm(doctorToForm(doctor));
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
  };

  const softDelete = async (doctor: AdminDoctor) => {
    if (!confirmAction(`Soft delete ${doctor.name}?`)) {
      return;
    }

    try {
      await softDeleteDoctor(doctor.id).unwrap();
      toast({ title: "Doctor soft deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search doctors"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
            value={gender}
            onChange={(event) => {
              setGender(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Any gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {editing && form ? (
        <DoctorEditModal
          form={form}
          isLoading={isUpdating}
          onChange={updateField}
          onClose={closeEdit}
          onSubmit={submitEdit}
        />
      ) : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={6}>Loading doctors...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={6}>Could not load doctors.</td></tr>
                ) : doctors.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={6}>No doctors found.</td></tr>
                ) : doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="cursor-pointer border-b transition-colors hover:bg-slate-50"
                    tabIndex={0}
                    onClick={() => router.push(`/dashboard/admin/doctors/${doctor.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        router.push(`/dashboard/admin/doctors/${doctor.id}`);
                      }
                    }}
                  >
                    <td className="p-4 font-medium text-slate-950">{doctor.name}<p className="text-xs text-slate-500">{doctor.email}</p></td>
                    <td className="p-4">{doctor.contactNumber ?? "-"}</td>
                    <td className="p-4">{doctor.designation ?? "-"}</td>
                    <td className="p-4">{doctor.appointmentFee ?? "-"}</td>
                    <td className="p-4">{doctor.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); openEdit(doctor); }}>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" size="sm" variant="destructive" disabled={isDeleting} onClick={(event) => { event.stopPropagation(); softDelete(doctor); }}>
                          <Trash2 className="h-4 w-4" />
                          Soft delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Next</Button>
      </div>
    </div>
  );
}
