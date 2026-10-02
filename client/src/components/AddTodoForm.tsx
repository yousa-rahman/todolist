import { useState, type FormEvent } from 'react';
import { useCreateTodo } from '../hooks/useTodos';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 1000;

export default function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createTodo = useCreateTodo();

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
    createTodo.mutate({ title: trimmedTitle, description: description.trim() || undefined });
    setTitle('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            maxLength={TITLE_MAX}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
            className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            maxLength={DESCRIPTION_MAX}
          />
        </div>
        <button
          type="submit"
          disabled={createTodo.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Todo
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
