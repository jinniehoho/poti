import { supabase } from '../lib/supabase';

export type CareStatistics = {
  activePlantCount: number;
  totalWateringCount: number;
  thisMonthWateringCount: number;
  currentStreak: number;
  lastManagedAt: string | null;
};

type WateringHistoryRow = {
  watered_at: string;
};

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0',
  );
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentStreak(
  history: WateringHistoryRow[],
) {
  if (history.length === 0) {
    return 0;
  }

  const managedDateKeys = new Set(
    history.map((item) =>
      getLocalDateKey(new Date(item.watered_at)),
    ),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = getLocalDateKey(today);
  const yesterdayKey = getLocalDateKey(yesterday);

  let cursor: Date;

  if (managedDateKeys.has(todayKey)) {
    cursor = new Date(today);
  } else if (managedDateKeys.has(yesterdayKey)) {
    cursor = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;

  while (managedDateKeys.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getThisMonthWateringCount(
  history: WateringHistoryRow[],
) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return history.filter((item) => {
    const wateredAt = new Date(item.watered_at);

    return (
      wateredAt.getFullYear() === currentYear &&
      wateredAt.getMonth() === currentMonth
    );
  }).length;
}

export async function getCareStatistics(): Promise<CareStatistics> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '관리 통계를 보려면 사용자 인증이 필요합니다.',
    );
  }

  const {
    data: ownedPlants,
    error: ownedPlantsError,
  } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('is_active', true);

  if (ownedPlantsError) {
    throw ownedPlantsError;
  }

  const ownedPlantIds =
    (ownedPlants ?? []).map((plant) => plant.id);

  if (ownedPlantIds.length === 0) {
    return {
      activePlantCount: 0,
      totalWateringCount: 0,
      thisMonthWateringCount: 0,
      currentStreak: 0,
      lastManagedAt: null,
    };
  }

  const [
    wateringHistoryResult,
    activePlantCountResult,
  ] = await Promise.all([
    supabase
      .from('watering_history')
      .select('watered_at')
      .in('plant_id', ownedPlantIds)
      .order('watered_at', {
        ascending: false,
      }),

    supabase
      .from('plants')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', session.user.id)
      .eq('is_active', true),
  ]);

  if (wateringHistoryResult.error) {
    throw wateringHistoryResult.error;
  }

  if (activePlantCountResult.error) {
    throw activePlantCountResult.error;
  }

  const history =
    wateringHistoryResult.data as WateringHistoryRow[];

  return {
    activePlantCount:
      activePlantCountResult.count ?? 0,

    totalWateringCount: history.length,

    thisMonthWateringCount:
      getThisMonthWateringCount(history),

    currentStreak: getCurrentStreak(history),

    lastManagedAt:
      history[0]?.watered_at ?? null,
  };
}
