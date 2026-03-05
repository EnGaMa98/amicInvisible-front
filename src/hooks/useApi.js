import { useCallback } from 'react';
import { useLoading } from '@/context/LoadingProvider';
import { useSnackbar } from '@/context/SnackbarProvider';

export function useApi() {
  const { setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();

  const execute = useCallback(
    async (fn, { showLoading = true, successMessage = null } = {}) => {
      try {
        if (showLoading) setLoading(true);
        const result = await fn();
        if (successMessage) openSnackbar(successMessage, 'success');
        return result;
      } catch (error) {
        openSnackbar(error.message, 'error');
        throw error;
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [setLoading, openSnackbar]
  );

  return { execute };
}
