import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">TODO</h1>
        <p className="text-sm text-slate-500">Stay on top of things, one task at a time.</p>
      </header>

      <div className="mb-6">
        <AddTodoForm />
      </div>

      <TodoList />
    </div>
  );
}
