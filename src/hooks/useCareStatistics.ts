import { useCallback, useEffect, useState } from 'react';

import {
  getCareStatistics,
  type CareStatistics,
} from '../services/statisticsService';
import { useLanguage } from '../preferences/LanguageContext';

export function useCareStatistics() {
  const { t } = useLanguage();
  const [statistics, setStatistics] =
    useState<CareStatistics | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshStatistics =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result =
          await getCareStatistics();

        setStatistics(result);
      } catch (err) {
        console.error('Statistics query failed:', err);

        setError(t('home.statisticsError'));
      } finally {
        setIsLoading(false);
      }
    }, [t]);

  useEffect(() => {
    void refreshStatistics();
  }, [refreshStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refreshStatistics,
  };
}
