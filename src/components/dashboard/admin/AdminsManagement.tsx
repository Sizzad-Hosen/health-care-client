"use client";

import { FormEvent, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCw, Search, Shield, Trash2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useSoftDeleteAdminMutation,
  useUpdateAdminMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminUser, CreateAdminRequest } from "@/types/admin-dashboard";
import { totalPages } from "./utils";

type ApiErrorPayload = { data?: { message?: string }; error?: string };
type DeleteMode = "soft" | "hard";

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

const emptyForm: CreateAdminRequest = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  file: null,
};

export function AdminsManagement() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateAdminRequest>(emptyForm);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", contactNumber: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ admin: AdminUser; mode: DeleteMode } | null>(null);
  const { data, isFetching, isError, refetch } = useGetAdminsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
  });
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [softDeleteAdmin, { isLoading: isSoftDeleting }] = useSoftDeleteAdminMutation();
  const [deleteAdmin, { isLoading: isHardDeleting }] = useDeleteAdminMutation();
  const admins = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);
  const isDeleting = isSoftDeleting || isHardDeleting;

  const submitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createAdmin(createForm).unwrap();
      toast({ title: "Admin created", variant: "success" });
      setCreateOpen(false);
      setCreateForm(emptyForm);
      setPage(1);
    } catch (error) {
      toast({ title: "Create failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const openEdit = (admin: AdminUser) => {
    setEditing(admin);
    setEditForm({
      name: admin.name ?? "",
      email: admin.email ?? "",
      contactNumber: admin.contactNumber ?? "",
    });
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editing) {
      return;
    }

    try {
      await updateAdmin({
        id: editing.id,
        body: editForm,
      }).unwrap();
      toast({ title: "Admin updated", variant: "success" });
      setEditing(null);
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.mode === "soft") {
        await softDeleteAdmin(deleteTarget.admin.id).unwrap();
        toast({ title: "Admin soft deleted", variant: "success" });
      } else {
        await deleteAdmin(deleteTarget.admin.id).unwrap();
        toast({ title: "Admin permanently deleted", variant: "success" });
      }
      setDeleteTarget(null);
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search admins"
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
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create admin
          </Button>
        </CardContent>
      </Card>

      {isCreateOpen ? (
        <Modal title="Create admin" description="Add a new admin account." onClose={() => setCreateOpen(false)}>
          <form className="grid gap-4" onSubmit={submitCreate}>
            <Input placeholder="Name" value={createForm.name} onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))} required />
            <Input type="email" placeholder="Email" value={createForm.email} onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))} required />
            <Input placeholder="Contact number" value={createForm.contactNumber} onChange={(event) => setCreateForm((current) => ({ ...current, contactNumber: event.target.value }))} required />
            <Input type="password" placeholder="Password" value={createForm.password} onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))} required />
            <Input type="file" accept="image/*" onChange={(event) => setCreateForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} />
            <ModalActions isLoading={isCreating} icon={Plus} submitLabel="Create admin" onCancel={() => setCreateOpen(false)} />
          </form>
        </Modal>
      ) : null}

      {editing ? (
        <Modal title="Edit admin" description="Update admin profile fields." onClose={() => setEditing(null)}>
          <form className="grid gap-4" onSubmit={submitEdit}>
            <Input placeholder="Name" value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} required />
            <Input type="email" placeholder="Email" value={editForm.email} onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))} required />
            <Input placeholder="Contact number" value={editForm.contactNumber} onChange={(event) => setEditForm((current) => ({ ...current, contactNumber: event.target.value }))} required />
            <ModalActions isLoading={isUpdating} icon={Edit3} submitLabel="Save changes" onCancel={() => setEditing(null)} />
          </form>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title={deleteTarget.mode === "soft" ? "Soft delete admin" : "Hard delete admin"}
          description={`Confirm ${deleteTarget.mode === "soft" ? "soft delete" : "permanent delete"} for ${deleteTarget.admin.name}.`}
          onClose={() => setDeleteTarget(null)}
        >
          <Alert className="border-red-200 bg-red-50 text-red-900">
            <AlertDescription>
              {deleteTarget.mode === "soft"
                ? "This will mark the admin account as deleted."
                : "This permanently removes the admin profile and linked user account."}
            </AlertDescription>
          </Alert>
          <div className="mt-5 flex gap-2">
            <Button type="button" variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Confirm delete
            </Button>
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      ) : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={4}>Loading admins...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={4}>Could not load admins.</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={4}>No admins found.</td></tr>
                ) : admins.map((admin) => (
                  <tr key={admin.id} className="border-b">
                    <td className="p-4 font-medium text-slate-950">
                      <span className="inline-flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-700" />
                        {admin.name}
                      </span>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </td>
                    <td className="p-4">{admin.contactNumber ?? "-"}</td>
                    <td className="p-4">{admin.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => openEdit(admin)}>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setDeleteTarget({ admin, mode: "soft" })}>
                          <Trash2 className="h-4 w-4" />
                          Soft delete
                        </Button>
                        <Button type="button" size="sm" variant="destructive" onClick={() => setDeleteTarget({ admin, mode: "hard" })}>
                          <Trash2 className="h-4 w-4" />
                          Hard delete
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

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({
  isLoading,
  icon: Icon,
  submitLabel,
  onCancel,
}: {
  isLoading: boolean;
  icon: LucideIcon;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        {submitLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
