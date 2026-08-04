import { supabase } from '../lib/supabase';
import {
  translate,
  type AppLanguage,
  type TranslationKey,
} from '../i18n/translations';

export type PlantLocation = {
  id: string;
  name: string;
  sortOrder: number;
};

type PlantLocationRow = {
  id: string;
  name: string;
  sort_order: number;
};

const defaultLocationKeys: Record<
  string,
  TranslationKey
> = {
  '거실': 'location.default.livingRoom',
  '침실': 'location.default.bedroom',
  '주방': 'location.default.kitchen',
  '욕실': 'location.default.bathroom',
  '발코니': 'location.default.balcony',
  '서재': 'location.default.study',
  '현관': 'location.default.entryway',
  '야외': 'location.default.outdoors',
};

export function getLocalizedPlantLocationName(
  name: string,
  language: AppLanguage,
) {
  const key = defaultLocationKeys[name];
  return key ? translate(language, key) : name;
}

async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '위치 정보를 사용하려면 사용자 인증이 필요합니다.',
    );
  }

  return session.user.id;
}

function toPlantLocation(
  row: PlantLocationRow,
  language: AppLanguage,
): PlantLocation {
  return {
    id: row.id,
    name: getLocalizedPlantLocationName(
      row.name,
      language,
    ),
    sortOrder: row.sort_order,
  };
}

export async function getPlantLocations(
  language: AppLanguage,
): Promise<
  PlantLocation[]
> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('plant_locations')
    .select('id, name, sort_order')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PlantLocationRow[]).map(
    (row) => toPlantLocation(row, language),
  );
}

export async function createPlantLocation(
  name: string,
): Promise<PlantLocation> {
  const userId = await getCurrentUserId();
  const normalizedName = name.trim();

  if (
    normalizedName.length === 0 ||
    normalizedName.length > 50
  ) {
    throw new Error('INVALID_LOCATION_NAME');
  }

  const { data: lastLocation, error: orderError } =
    await supabase
      .from('plant_locations')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

  if (orderError) {
    throw orderError;
  }

  const { data, error } = await supabase
    .from('plant_locations')
    .insert({
      user_id: userId,
      name: normalizedName,
      sort_order:
        (lastLocation?.sort_order ?? 0) + 10,
    })
    .select('id, name, sort_order')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('DUPLICATE_LOCATION_NAME');
    }

    throw error;
  }

  return toPlantLocation(data as PlantLocationRow, 'ko');
}

export async function deletePlantLocation(
  id: string,
): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('plant_locations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
