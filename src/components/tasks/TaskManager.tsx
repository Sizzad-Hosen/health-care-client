"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hooks/useTasks";
import { CreateTaskRequest, Task, TaskPriority, TaskStatus } from "@/types/task";

const initialForm: CreateTaskRequest = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

export function TaskManager() {
  const {
    createTask,
    deleteTask,
    error,
    isEmpty,
    isError,
    isLoading,
    isMutating,
    refresh,
    success,
    tasks,
    updateTask,
  } = useTasks();
  const [form, setForm] = useState<CreateTaskRequest>(initialForm);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!form.title.trim()) {
      setValidationError("Task title is required.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      dueDate: form.dueDate || undefined,
    };

    if (editingTask) {
      await updateTask(editingTask.id, payload);
      setEditingTask(null);
    } else {
      await createTask(payload);
    }

    setForm(initialForm);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) ?? "",
    });
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    await deleteTask(task.id);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingTask ? "Update task" : "Add task"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" onSubmit={handleSubmit}>
            {validationError ? (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Review appointment queue"
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Optional details"
                />
              </FormControl>
            </FormItem>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as TaskStatus,
                      }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.priority}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        priority: event.target.value as TaskPriority,
                      }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Due date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                  />
                </FormControl>
              </FormItem>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isMutating}>
                {editingTask ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingTask ? "Update task" : "Create task"}
              </Button>
              {editingTask ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTask(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Tasks</CardTitle>
          <Button variant="outline" size="sm" onClick={() => void refresh()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                {error.includes("404") || error.toLowerCase().includes("not found")
                  ? " The frontend is wired to /api/v1/tasks, but the current Express backend does not expose that route yet."
                  : ""}
              </AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-md bg-slate-100" />
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Task data could not be loaded from the backend.
            </div>
          ) : null}

          {isEmpty ? (
            <div className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No tasks exist yet.
            </div>
          ) : null}

          {!isLoading && !isError && tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-md border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium text-slate-950">{task.title}</h3>
                      {task.description ? (
                        <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge>{task.status}</Badge>
                        <Badge variant="secondary">{task.priority}</Badge>
                        {task.dueDate ? <Badge variant="outline">{task.dueDate}</Badge> : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDelete(task)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
