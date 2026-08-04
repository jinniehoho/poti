import { useFocusEffect } from 'expo-router';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { useLanguage } from '../preferences/LanguageContext';
import {
  getCareCalendar,
  recordLocalActivityDay,
  type CareCalendarData,
} from '../services/careCalendarService';

const emptyCalendar: CareCalendarData = {
  activePlantCount: 0,
  wateringDueDates: [],
  wateringDuePlantIdsByDate: {},
  wateredDates: [],
};

export function useCareCalendar(
  year: number,
  month: number,
) {
  const { t } = useLanguage();
  const [calendar, setCalendar] =
    useState<CareCalendarData>(emptyCalendar);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const requestId = useRef(0);

  const refreshCalendar = useCallback(async () => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    try {
      setIsLoading(true);
      setError(null);
      const result = await getCareCalendar(
        year,
        month,
      );

      if (requestId.current === currentRequest) {
        setCalendar(result);
      }
    } catch (refreshError) {
      console.error(
        'Care calendar query failed:',
        refreshError,
      );

      if (requestId.current === currentRequest) {
        setError(t('home.calendar.error'));
      }
    } finally {
      if (requestId.current === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [month, t, year]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void recordLocalActivityDay().then(() => {
        if (active) {
          void refreshCalendar();
        }
      });

      return () => {
        active = false;
      };
    }, [refreshCalendar]),
  );

  return {
    calendar,
    isLoading,
    error,
    refreshCalendar,
  };
}
