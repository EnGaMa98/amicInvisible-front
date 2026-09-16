import { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 backdrop-blur-sm">
          <div className="editorial-surface rounded-2xl p-6">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
