import { useState, type FormEvent } from 'react';
import type { Todo } from '../types/todo';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 1000;

interface EditTodoFormProps {
  todo: Todo;
  onCancel: () => void;
  onSave: (input: { title: string; description?: string }) => void;
  isSaving: boolean;
}

export default function EditTodoForm({ todo, onCancel, onSave, isSaving }: EditTodoFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }
    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be at most ${TITLE_MAX} characters`);
      return;
    }
    if (description.length > DESCRIPTION_MAX) {
      setError(`Description must be at most ${DESCRIPTION_MAX} characters`);
      return;
    }

    setError(null);
    onSave({ title: trimmedTitle, description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        maxLength={TITLE_MAX}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        maxLength={DESCRIPTION_MAX}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
