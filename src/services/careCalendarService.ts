import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '../lib/supabase';
import {
  getLocalDateKey,
  getMonthBounds,
  isSameLocalMonth,
  parseCalendarDate,
} from '../utils/calendar';

const ACTIVITY_STORAGE_KEY =
  'poti.localActivityDates';
const MAX_ACTIVITY_DATES = 400;

type WateringDateRow = {
  watered_at: string;
};

type WateringStatusDateRow = {
  plant_id: number;
  next_watering_at: string | null;
};

export type CareCalendarData = {
  activePlantCount: number;
  wateringDueDates: string[];
  wateringDuePlantIdsByDate: Record<
    string,
    number[]
  >;
  wateredDates: string[];
};

async function getStoredActivityDates() {
  const stored = await AsyncStorage.getItem(
    ACTIVITY_STORAGE_KEY,
  );

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is string =>
            typeof value === 'string',
        )
      : [];
  } catch {
    return [];
  }
}

export async function recordLocalActivityDay() {
  const dates = await getStoredActivityDates();
  const nextDates = Array.from(
    new Set([...dates, getLocalDateKey(new Date())]),
  )
    .sort()
    .slice(-MAX_ACTIVITY_DATES);

  await AsyncStorage.setItem(
    ACTIVITY_STORAGE_KEY,
    JSON.stringify(nextDates),
  );
}

export async function getCareCalendar(
  year: number,
  month: number,
): Promise<CareCalendarData> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '관리 달력을 보려면 사용자 인증이 필요합니다.',
    );
  }

  const { data: plants, error: plantsError } =
    await supabase
      .from('plants')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('is_active', true);

  if (plantsError) {
    throw plantsError;
  }

  const plantIds = (plants ?? []).map(
    (plant) => plant.id,
  );
  if (plantIds.length === 0) {
    return {
      activePlantCount: 0,
      wateringDueDates: [],
      wateringDuePlantIdsByDate: {},
      wateredDates: [],
    };
  }

  const { start, end } = getMonthBounds(
    year,
    month,
  );
  const [historyResult, statusResult] =
    await Promise.all([
      supabase
        .from('watering_history')
        .select('watered_at')
        .in('plant_id', plantIds)
        .gte('watered_at', start.toISOString())
        .lt('watered_at', end.toISOString()),
      supabase
        .from('v_plant_watering_status')
        .select('plant_id, next_watering_at')
        .in('plant_id', plantIds),
    ]);

  if (historyResult.error) {
    throw historyResult.error;
  }

  if (statusResult.error) {
    throw statusResult.error;
  }

  const wateredDates = Array.from(
    new Set(
      (
        historyResult.data as WateringDateRow[]
      ).map((row) =>
        getLocalDateKey(new Date(row.watered_at)),
      ),
    ),
  );
  const wateringDuePlantIdsByDate: Record<
    string,
    number[]
  > = {};

  (
    statusResult.data as WateringStatusDateRow[]
  ).forEach((row) => {
    const date = row.next_watering_at
      ? parseCalendarDate(row.next_watering_at)
      : null;

    if (
      !date ||
      Number.isNaN(date.getTime()) ||
      !isSameLocalMonth(date, year, month)
    ) {
      return;
    }

    const dateKey = getLocalDateKey(date);
    const plantIdsForDate =
      wateringDuePlantIdsByDate[dateKey] ?? [];

    if (!plantIdsForDate.includes(row.plant_id)) {
      wateringDuePlantIdsByDate[dateKey] = [
        ...plantIdsForDate,
        row.plant_id,
      ];
    }
  });

  const wateringDueDates = Object.keys(
    wateringDuePlantIdsByDate,
  );
  return {
    activePlantCount: plantIds.length,
    wateringDueDates,
    wateringDuePlantIdsByDate,
    wateredDates,
  };
}
