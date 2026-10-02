import AddTodoForm from './components/AddTodoForm';
import AuthScreen from './components/AuthScreen';
import TodoList from './components/TodoList';
import UserBar from './components/UserBar';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <div className="mx-auto max-w-2xl px-4 py-10 text-sm text-slate-500">Loading…</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 py-10">
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">TODO</h1>
          <p className="text-sm text-slate-500">Stay on top of things, one task at a time.</p>
        </div>
        <UserBar />
      </header>

      <div className="mb-6">
        <AddTodoForm />
      </div>

      <TodoList />
    </div>
  );
}
