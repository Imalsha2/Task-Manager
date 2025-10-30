import { Task } from "../types";

const API_BASE = ((import.meta as any).env?.VITE_API_BASE) || "http://localhost:4000";

async function handleResp(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText || "API error");
  }
  return res.status === 204 ? null : res.json();
}

export async function listTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/api/tasks`);
  return handleResp(res);
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  return handleResp(res);
}

export async function getTask(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`);
  return handleResp(res);
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  return handleResp(res);
}

export async function toggleTask(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/toggle`, { method: "PATCH" });
  return handleResp(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
  return handleResp(res);
}
