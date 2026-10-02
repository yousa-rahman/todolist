import { useAuth } from '../context/AuthContext';

export default function UserBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500">
        Signed in as <span className="font-medium text-slate-700">{user.username}</span>
      </span>
      <button
        type="button"
        onClick={logout}
        className="rounded-md px-2 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      >
        Logout
      </button>
    </div>
  );
}
