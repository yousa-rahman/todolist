import { useState } from 'react';
import type { Todo } from '../types/todo';
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from '../hooks/useTodos';
import EditTodoForm from './EditTodoForm';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleTodo = useToggleTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  if (isEditing) {
    return (
      <li className="animate-fade-in rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <EditTodoForm
          todo={todo}
          isSaving={updateTodo.isPending}
          onCancel={() => setIsEditing(false)}
          onSave={(input) => {
            updateTodo.mutate({ id: todo._id, input });
            setIsEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li
      className={`animate-fade-in flex items-start gap-3 rounded-lg border p-4 shadow-sm transition ${
        todo.done ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => toggleTodo.mutate(todo._id)}
        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          todo.done ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        {todo.done && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 00-1.408-1.42l-7.3 7.22-3.29-3.29a1 1 0 00-1.414 1.414l4 4a1 1 0 001.41.002l8-7.924z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`break-words font-medium ${todo.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className={`mt-1 break-words text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteTodo.mutate(todo._id)}
          className="rounded-md px-2 py-1 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
