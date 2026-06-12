"use client";

import { FormEvent, useState } from "react";
import { Edit3, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useCreateSchedulesMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { AdminSchedule, CreateScheduleRequest } from "@/types/admin-dashboard";
import { confirmAction, formatSchedule, totalPages } from "./utils";

type ApiErrorPayload = { data?: { message?: string }; error?: string };

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;
  return apiError.data?.message ?? apiError.error ?? "Action failed.";
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function dateInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timeInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function scheduleToForm(schedule: AdminSchedule): CreateScheduleRequest {
  return {
    startDate: dateInputValue(schedule.startDate),
    endDate: dateInputValue(schedule.endDate),
    startTime: timeInputValue(schedule.startDate),
    endTime: timeInputValue(schedule.endDate),
  };
}

export function SchedulesManagement() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
  });
  const [editing, setEditing] = useState<AdminSchedule | null>(null);
  const [editForm, setEditForm] = useState<CreateScheduleRequest>({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const { data, isFetching, isError } = useGetSchedulesQuery({ page, limit: 10 });
  const [createSchedules, { isLoading: isCreating }] = useCreateSchedulesMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();
  const schedules = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createSchedules(form).unwrap();
      toast({ title: "Schedule slots created", variant: "success" });
    } catch (error) {
      toast({ title: "Create failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const openEdit = (schedule: AdminSchedule) => {
    setEditing(schedule);
    setEditForm(scheduleToForm(schedule));
  };

  const closeEdit = () => {
    setEditing(null);
    setEditForm({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    });
  };

  const update = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editing) {
      return;
    }

    try {
      await updateSchedule({
        id: editing.id,
        ...editForm,
      }).unwrap();
      toast({ title: "Schedule updated", variant: "success" });
      closeEdit();
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  const remove = async (id: string) => {
    if (!confirmAction("Delete this schedule slot?")) return;
    try {
      await deleteSchedule(id).unwrap();
      toast({ title: "Schedule deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Delete failed", description: getErrorMessage(error), variant: "error" });
    }
  };

  return (
    <div className="space-y-5">
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={closeEdit}>
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Edit schedule</h2>
                <p className="text-sm text-slate-500">Update this schedule slot date and time.</p>
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={closeEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="grid gap-3 p-5 md:grid-cols-2" onSubmit={update}>
              <Input type="date" value={editForm.startDate} onChange={(event) => setEditForm((current) => ({ ...current, startDate: event.target.value }))} required />
              <Input type="date" value={editForm.endDate} onChange={(event) => setEditForm((current) => ({ ...current, endDate: event.target.value }))} required />
              <Input type="time" value={editForm.startTime} onChange={(event) => setEditForm((current) => ({ ...current, startTime: event.target.value }))} required />
              <Input type="time" value={editForm.endTime} onChange={(event) => setEditForm((current) => ({ ...current, endTime: event.target.value }))} required />
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                  Save changes
                </Button>
                <Button type="button" variant="ghost" onClick={closeEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-5" onSubmit={create}>
            <Input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} required />
            <Input type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} required />
            <Input type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} required />
            <Input type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} required />
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create slots
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[680px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr><th className="p-4">Schedule</th><th className="p-4">ID</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={3}>Loading schedules...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={3}>Could not load schedules.</td></tr>
                ) : schedules.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={3}>No schedules found.</td></tr>
                ) : schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b">
                    <td className="p-4 font-medium text-slate-950">{formatSchedule(schedule)}</td>
                    <td className="p-4 text-xs text-slate-500">{schedule.id}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => openEdit(schedule)}>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" size="sm" variant="destructive" disabled={isDeleting} onClick={() => remove(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                          Delete
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
