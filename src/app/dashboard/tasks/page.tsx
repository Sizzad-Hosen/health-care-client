"use client";

import { useSelector } from "react-redux";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TaskManager } from "@/components/tasks/TaskManager";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/redux/store";

export default function TasksPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ProtectedRoute>
      <DashboardLayout role={user?.role ?? "patient"}>
        <div className="mb-6">
          <Badge variant="secondary">Backend CRUD</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Task management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create, load, update, and delete tasks through the configured
            backend API.
          </p>
        </div>
        <TaskManager />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
