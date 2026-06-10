import { apiClient } from "@/lib/apiClient";
import { ApiListResponse, ApiResponse } from "@/types/api";
import { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types/task";

const TASKS_PATH = "/api/v1/tasks";

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient<ApiListResponse<Task>>(TASKS_PATH);
  return response.data;
}

export async function createTask(payload: CreateTaskRequest): Promise<Task> {
  const response = await apiClient<ApiResponse<Task>>(TASKS_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateTask(
  id: string,
  payload: UpdateTaskRequest,
): Promise<Task> {
  const response = await apiClient<ApiResponse<Task>>(`${TASKS_PATH}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient<ApiResponse<null>>(`${TASKS_PATH}/${id}`, {
    method: "DELETE",
  });
}
