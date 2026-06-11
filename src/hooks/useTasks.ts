"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
} from "@/services/taskApi";
import { AsyncStatus } from "@/types/api";
import { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [mutationStatus, setMutationStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const result = await getTasks();
      setTasks(result);
      setStatus("success");
    } catch (caughtError) {
      setTasks([]);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load tasks.",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTasks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTasks]);

  const createTask = async (payload: CreateTaskRequest) => {
    setMutationStatus("loading");
    setError(null);
    setSuccess(null);

    try {
      await createTaskRequest(payload);
      setSuccess("Task created successfully.");
      setMutationStatus("success");
      await loadTasks();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to create task.";

      setMutationStatus("error");
      setError(message);
      throw new Error(message);
    }
  };

  const updateTask = async (id: string, payload: UpdateTaskRequest) => {
    setMutationStatus("loading");
    setError(null);
    setSuccess(null);

    try {
      await updateTaskRequest(id, payload);
      setSuccess("Task updated successfully.");
      setMutationStatus("success");
      await loadTasks();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to update task.";

      setMutationStatus("error");
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTask = async (id: string) => {
    setMutationStatus("loading");
    setError(null);
    setSuccess(null);

    try {
      await deleteTaskRequest(id);
      setSuccess("Task deleted successfully.");
      setMutationStatus("success");
      await loadTasks();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to delete task.";

      setMutationStatus("error");
      setError(message);
      throw new Error(message);
    }
  };

  return {
    createTask,
    deleteTask,
    error,
    isEmpty: status === "success" && tasks.length === 0,
    isError: status === "error",
    isLoading: status === "loading" || status === "idle",
    isMutating: mutationStatus === "loading",
    refresh: loadTasks,
    success,
    tasks,
    updateTask,
  };
}
