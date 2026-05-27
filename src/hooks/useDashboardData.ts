import { useState, useEffect, useMemo, useCallback } from 'react';
import type { PromptGeneratorPro } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';

export function useDashboardData() {
  const [promptGeneratorPro, setPromptGeneratorPro] = useState<PromptGeneratorPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [promptGeneratorProData] = await Promise.all([
        LivingAppsService.getPromptGeneratorPro(),
      ]);
      setPromptGeneratorPro(promptGeneratorProData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fehler beim Laden der Daten'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Silent background refresh (no loading state change → no flicker)
  useEffect(() => {
    async function silentRefresh() {
      try {
        const [promptGeneratorProData] = await Promise.all([
          LivingAppsService.getPromptGeneratorPro(),
        ]);
        setPromptGeneratorPro(promptGeneratorProData);
      } catch {
        // silently ignore — stale data is better than no data
      }
    }
    function handleRefresh() { void silentRefresh(); }
    window.addEventListener('dashboard-refresh', handleRefresh);
    return () => window.removeEventListener('dashboard-refresh', handleRefresh);
  }, []);

  return { promptGeneratorPro, setPromptGeneratorPro, loading, error, fetchAll };
}