"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Edit3, Loader2, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useGetPatientsQuery,
  useSoftDeletePatientMutation,
  useUpdatePatientMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminPatient } from "@/types/admin-dashboard";
import { confirmAction, totalPages } from "./utils";

type PatientForm = {
  name: string;
  contactNumber: string;
  address: string;
};

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

function toForm(patient: AdminPatient): PatientForm {
  return {
    name: patient.name ?? "",
    contactNumber: patient.contactNumber ?? "",
    address: patient.address ?? "",
  };
}

export function PatientsManagement() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<AdminPatient | null>(null);
  const [form, setForm] = useState<PatientForm | null>(null);
  const { data, isFetching, isError, refetch } = useGetPatientsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
  });
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [softDeletePatient, { isLoading: isDeleting }] = useSoftDeletePatientMutation();
  const patients = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  const updateField =
    (field: keyof PatientForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => (current ? { ...current, [field]: event.target.value } : current));
    };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !form) return;

    try {
      await updatePatient({
        id: editing.id ?? "",
        body: {
          name: form.name,
          contactNumber: form.contactNumber,
          contactNo: form.contactNumber,
          address: form.address,
        },
      }).unwrap();
      toast({ title: "Patient updated", variant: "success" });
      setEditing(null);
      setForm(null);
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const softDelete = async (patient: AdminPatient) => {
    if (!patient.id || !confirmAction(`Soft delete ${patient.name}?`)) return;

    try {
      await softDeletePatient(patient.id).unwrap();
      toast({ title: "Patient soft deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search patients"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {editing && form ? (
        <Card>
          <CardContent className="p-5">
            <form className="grid gap-4 md:grid-cols-3" onSubmit={submitEdit}>
              <Input placeholder="Name" value={form.name} onChange={updateField("name")} />
              <Input placeholder="Contact number" value={form.contactNumber} onChange={updateField("contactNumber")} />
              <Input placeholder="Address" value={form.address} onChange={updateField("address")} />
              <div className="flex gap-2 md:col-span-3">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                  Save
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>Loading patients...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={5}>Could not load patients.</td></tr>
                ) : patients.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>No patients found.</td></tr>
                ) : patients.map((patient) => (
                  <tr key={patient.id} className="border-b">
                    <td className="p-4 font-medium text-slate-950">{patient.name}<p className="text-xs text-slate-500">{patient.email}</p></td>
                    <td className="p-4">{patient.contactNumber ?? "-"}</td>
                    <td className="p-4">{patient.address ?? "-"}</td>
                    <td className="p-4">{patient.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => { setEditing(patient); setForm(toForm(patient)); }}>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" size="sm" variant="destructive" disabled={isDeleting} onClick={() => softDelete(patient)}>
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
