import { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
