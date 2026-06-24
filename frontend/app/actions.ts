"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export async function getTodos(filter?: string, search?: string): Promise<Todo[]> {
  const queryParams = new URLSearchParams();
  if (filter) queryParams.append("filter", filter);
  if (search) queryParams.append("search", search);

  const url = `${BACKEND_URL}/todos?${queryParams.toString()}`;
  try {
    const res = await fetch(url, {
      cache: "no-store", // Ensure server always requests fresh data from backend
    });
    if (!res.ok) {
      throw new Error("Failed to fetch todos");
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getTodos Server Action:", error);
    throw error;
  }
}

export async function getTodoById(id: number): Promise<Todo | null> {
  const url = `${BACKEND_URL}/todos`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch todos to find item");
    }
    const todos: Todo[] = await res.json();
    const todo = todos.find((t) => t.id === id);
    return todo || null;
  } catch (error) {
    console.error("Error in getTodoById Server Action:", error);
    throw error;
  }
}

export async function createTodo(formData: { title: string; description?: string }): Promise<Todo> {
  const url = `${BACKEND_URL}/todos`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error("Failed to create todo");
    }
    const data = await res.json();
    revalidatePath("/todos");
    return data;
  } catch (error) {
    console.error("Error in createTodo Server Action:", error);
    throw error;
  }
}

export async function updateTodo(
  id: number,
  formData: { title?: string; description?: string; completed?: boolean }
): Promise<Todo> {
  const url = `${BACKEND_URL}/todos/${id}`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error("Failed to update todo");
    }
    const data = await res.json();
    revalidatePath("/todos");
    return data;
  } catch (error) {
    console.error("Error in updateTodo Server Action:", error);
    throw error;
  }
}

export async function deleteTodo(id: number): Promise<void> {
  const url = `${BACKEND_URL}/todos/${id}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete todo");
    }
    revalidatePath("/todos");
  } catch (error) {
    console.error("Error in deleteTodo Server Action:", error);
    throw error;
  }
}
