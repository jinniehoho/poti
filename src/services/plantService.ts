import { supabase } from '../lib/supabase';

export type CreatePlantInput = {
  plantTypeId: number;
  displayName: string;
  wateringMode: 'automatic' | 'custom';
  customIntervalDays: number | null;
};

type PlantRow = {
  id: number;
  plant_type_id: number;
  display_name: string;
  watering_mode: 'automatic' | 'custom';
  custom_interval_days: number | null;
  created_at: string;
  is_active: boolean;
};

export async function createPlant(
  input: CreatePlantInput,
): Promise<PlantRow> {
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