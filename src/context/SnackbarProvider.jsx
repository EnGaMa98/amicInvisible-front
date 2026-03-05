import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);

  const openSnackbar = useCallback((message, type = 'success') => {
    setSnackbar({ message, type });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(null);
  }, []);

  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(closeSnackbar, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar, closeSnackbar]);

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      {snackbar && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-white ${
              snackbar.type === 'success' ? 'bg-pine-500' : 'bg-festive-500'
            }`}
          >
            {snackbar.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{snackbar.message}</span>
            <button onClick={closeSnackbar} className="ml-2 shrink-0 hover:opacity-70 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
