import { useTodos } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import ErrorBanner from './ErrorBanner';

function SkeletonRow() {
  return <div className="h-[60px] animate-pulse rounded-lg border border-slate-200 bg-slate-100" />;
}

export default function TodoList() {
  const { data: todos, isLoading, isError, error, refetch } = useTodos();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        message={error instanceof Error ? error.message : 'Failed to load todos.'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!todos || todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </ul>
  );
}
