import { apiRequest } from './client';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

export function getTodos(): Promise<Todo[]> {
  return apiRequest<Todo[]>('/todos');
}

export function createTodo(input: CreateTodoInput): Promise<Todo> {
  return apiRequest<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) });
}

export function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function toggleTodoDone(id: string): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${id}/done`, { method: 'PATCH' });
}

export function deleteTodo(id: string): Promise<void> {
  return apiRequest<void>(`/todos/${id}`, { method: 'DELETE' });
}
