import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from '@/context/LoadingProvider';
import { SnackbarProvider } from '@/context/SnackbarProvider';
import { AuthProvider } from '@/context/AuthProvider';
import AppRoutes from '@/router/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <SnackbarProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </SnackbarProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}
