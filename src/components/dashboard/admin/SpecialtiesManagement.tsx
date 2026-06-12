"use client";

import { FormEvent, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useCreateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useGetSpecialtiesQuery,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { confirmAction } from "./utils";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

export function SpecialtiesManagement() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { data, isFetching, isError } = useGetSpecialtiesQuery();
  const [createSpecialty, { isLoading: isCreating }] = useCreateSpecialtyMutation();
  const [deleteSpecialty, { isLoading: isDeleting }] = useDeleteSpecialtyMutation();
  const specialties = data?.data ?? [];

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createSpecialty({ title, file }).unwrap();
      toast({ title: "Specialty created", variant: "success" });
      setTitle("");
      setFile(null);
    } catch (error) {
      toast({ title: "Create failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirmAction(`Delete specialty ${name}?`)) return;

    try {
      await deleteSpecialty(id).unwrap();
      toast({ title: "Specialty deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={create}>
            <Input placeholder="Specialty title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Button type="submit" disabled={isCreating || !title.trim()}>
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr><th className="p-4">Specialty</th><th className="p-4">Icon</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={3}>Loading specialties...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={3}>Could not load specialties.</td></tr>
                ) : specialties.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={3}>No specialties found.</td></tr>
                ) : specialties.map((specialty) => (
                  <tr key={specialty.id} className="border-b">
                    <td className="p-4 font-medium text-slate-950">{specialty.title}</td>
                    <td className="p-4">{specialty.icon ? "Uploaded" : "-"}</td>
                    <td className="p-4 text-right">
                      <Button type="button" size="sm" variant="destructive" disabled={isDeleting} onClick={() => remove(specialty.id, specialty.title)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
