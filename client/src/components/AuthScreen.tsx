import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const PASSWORD_MIN = 8;

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const isRegister = mode === 'register';

  function validate(): string | null {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return 'Username is required';
    if (isRegister && (trimmedUsername.length < USERNAME_MIN || trimmedUsername.length > USERNAME_MAX)) {
      return `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters`;
    }
    if (isRegister && !/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return 'Username may only contain letters, numbers, and underscores';
    }
    if (!password) return 'Password is required';
    if (isRegister && password.length < PASSWORD_MIN) {
      return `Password must be at least ${PASSWORD_MIN} characters`;
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(username.trim(), password);
      } else {
        await login(username.trim(), password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">{isRegister ? 'Create an account' : 'Welcome back'}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {isRegister ? 'Sign up to start tracking your own todos.' : 'Log in to see your todos.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            autoComplete="username"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRegister ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(isRegister ? 'login' : 'register');
          setError(null);
        }}
        className="mt-4 w-full text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
      >
        {isRegister ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
