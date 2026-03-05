import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, LogOut, Users, LayoutGrid, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function AppLayout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="relative" ref={dropdownRef}>
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
            <span className="px-2 text-sm text-gray-500 hidden sm:block">
              {user?.fields?.name || user?.fields?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Tancar sessió"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sortir</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
