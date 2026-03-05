import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import AppLayout from '@/components/layouts/AppLayout';
import LoginPage from '@/components/features/Auth/LoginPage';
import GroupsList from '@/components/features/Groups/GroupsList';
import GroupDetail from '@/components/features/Groups/GroupDetail';
import UsersList from '@/components/features/Users/UsersList';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <AppLayout>{children}</AppLayout>;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><GroupsList /></PrivateRoute>} />
      <Route path="/groups/:id" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
      <Route path="/users" element={<AdminRoute><UsersList /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
