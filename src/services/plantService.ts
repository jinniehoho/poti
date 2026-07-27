import type { Plant } from '../types/plant';
import { supabase } from '../lib/supabase';

export type CreatePlantInput = {
  plantTypeId: number;
  displayName: string;
  wateringMode: 'automatic' | 'custom';
  customIntervalDays: number | null;
};

type CreatedPlantRow = {
  id: number;
  plant_type_id: number;
  display_name: string;
  watering_mode: 'automatic' | 'custom';
  custom_interval_days: number | null;
  created_at: string;
  is_active: boolean;
};

type PlantWithTypeRow = {
  id: number;
  display_name: string;
  watering_mode: 'automatic' | 'custom';
  custom_interval_days: number | null;

  plant_types: {
    emoji: string;
    default_interval_days: number;

    plant_type_translations: {
      name: string;
    }[];
  };
};

export async function createPlant(
  input: CreatePlantInput,
): Promise<CreatedPlantRow> {
  const { data, error } = await supabase
    .from('plants')
    .insert({
      plant_type_id: input.plantTypeId,
      display_name: input.displayName,
      watering_mode: input.wateringMode,
      custom_interval_days: input.customIntervalDays,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select(`
      id,
      display_name,
      watering_mode,
      custom_interval_days,
      plant_types!inner (
        emoji,
        default_interval_days,
        plant_type_translations!inner (
          name
        )
      )
    `)
    .eq('is_active', true)
    .eq(
      'plant_types.plant_type_translations.language_code',
      'ko',
    )
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as PlantWithTypeRow[];

  return rows.map((row) => {
    const intervalDays =
      row.watering_mode === 'custom'
        ? row.custom_interval_days ??
          row.plant_types.default_interval_days
        : row.plant_types.default_interval_days;

    return {
      id: row.id,
      name: row.display_name,
      typeName:
        row.plant_types.plant_type_translations[0]?.name ??
        '식물',
      emoji: row.plant_types.emoji,
      status: 'not_due',
      statusText: `${intervalDays}일 후`,
    };
  });
}