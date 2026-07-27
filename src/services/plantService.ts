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

type PlantWateringStatusRow = {
  plant_id: number;
  display_name: string;
  plant_type_name: string;
  emoji: string;
  days_until_watering: number;
  watering_status: 'overdue' | 'due_today' | 'not_due';
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
    .from('v_plant_watering_status')
    .select(`
      plant_id,
      display_name,
      plant_type_name,
      emoji,
      days_until_watering,
      watering_status
    `)
    .order('next_watering_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as PlantWateringStatusRow[];

  return rows.map((row) => {
    let statusText: string;

    if (row.days_until_watering < 0) {
      statusText = `${Math.abs(row.days_until_watering)}일 지남`;
    } else if (row.days_until_watering === 0) {
      statusText = '오늘';
    } else {
      statusText = `${row.days_until_watering}일 후`;
    }

    return {
      id: row.plant_id,
      name: row.display_name,
      typeName: row.plant_type_name,
      emoji: row.emoji,
      status: row.watering_status,
      statusText,
    };
  });
}