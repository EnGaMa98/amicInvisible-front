import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Gift, LayoutGrid, LogOut, Shield, UserCog, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import ProfileForm from '@/components/shared/ProfileForm';

export default function AppLayout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const adminRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.fields?.name || user?.fields?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();
  const groupsActive = location.pathname === '/' || location.pathname.startsWith('/groups/');
  const usersActive = location.pathname === '/users';

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/92 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3 text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-surface transition-transform group-hover:-rotate-3">
              <Gift className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span>
              <span className="display-title block text-xl leading-none">Amic Invisible</span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted sm:block">Regals amb intenció</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Navegació principal">
            <Link
              to="/"
              className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${groupsActive ? 'bg-brand-50 text-brand-800' : 'text-ink-muted hover:bg-surface-muted hover:text-ink'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grups</span>
            </Link>

            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${usersActive ? 'bg-brand-50 text-brand-800' : 'text-ink-muted hover:bg-surface-muted hover:text-ink'}`}
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Administració</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                </button>
                {adminOpen && (
                  <div className="editorial-surface absolute right-0 mt-2 w-48 rounded-xl p-1.5">
                    <Link
                      to="/users"
                      onClick={() => setAdminOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      <Users className="h-4 w-4" />
                      Usuaris
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="mx-1 h-6 w-px bg-line" />

            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex min-h-10 items-center gap-2 rounded-lg px-1.5 transition-colors hover:bg-surface-muted sm:px-2.5"
                aria-label="Menú de perfil"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                  {userInitial}
                </span>
                <span className="hidden max-w-32 truncate text-sm font-semibold text-ink sm:block">{userName}</span>
                <ChevronDown className={`hidden h-3.5 w-3.5 text-ink-muted transition-transform sm:block ${userOpen ? 'rotate-180' : ''}`} />
              </button>
              {userOpen && (
                <div className="editorial-surface absolute right-0 mt-2 w-52 rounded-xl p-1.5">
                  <div className="border-b border-line px-3 py-2 sm:hidden">
                    <p className="truncate text-sm font-semibold text-ink">{userName}</p>
                  </div>
                  <button
                    onClick={() => { setUserOpen(false); setProfileOpen(true); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                  >
                    <UserCog className="h-4 w-4" />
                    Editar perfil
                  </button>
                  <button
                    onClick={() => { setUserOpen(false); logout(); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Tancar sessió
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>

      <ProfileForm open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
