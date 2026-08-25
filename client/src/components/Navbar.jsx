import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="1" y="1" width="24" height="24" rx="6" stroke="#52B788" strokeWidth="1.5" />
            <path d="M7 17L11 10L14.5 14L19 8" stroke="#E3B23C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-xl tracking-tight">Expenzy</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted hidden sm:inline">
            Hi, <span className="text-paper">{user?.name?.split(' ')[0]}</span>
          </span>
          <button onClick={logout} className="btn-ghost text-sm py-2 px-3.5">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
