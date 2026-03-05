import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, LogOut, Users, LayoutGrid, Shield, ChevronDown, UserCog } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import ProfileForm from '@/components/shared/ProfileForm';

export default function AppLayout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const adminRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.fields?.name || user?.fields?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-festive-600 hover:text-festive-700 transition-colors">
            <Gift className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight">Amic Invisible</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grups</span>
            </Link>
            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gold-600 hover:bg-gold-50 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Panel admin</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                </button>
                {adminOpen && (
                  <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <Link
                      to="/users"
                      onClick={() => setAdminOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Users className="h-4 w-4 text-gray-400" />
                      Usuaris
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="mx-1 h-5 w-px bg-gray-200" />

            {/* User dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-festive-100 text-sm font-semibold text-festive-700">
                  {userInitial}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => { setUserOpen(false); setProfileOpen(true); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCog className="h-4 w-4 text-gray-400" />
                    Editar perfil
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => { setUserOpen(false); logout(); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-festive-600 hover:bg-festive-50 transition-colors"
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
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>

      <ProfileForm open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
