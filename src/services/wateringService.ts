import { supabase } from '../lib/supabase';

export type WateringRecord = {
  id: number;
  plant_id: number;
  watered_at: string;
  note: string | null;
};

export async function addWateringRecord(
  plantId: number,
): Promise<WateringRecord> {
  const { data, error } = await supabase
    .from('watering_history')
    .insert({
      plant_id: plantId,
    })
    .select('id, plant_id, watered_at, note')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteWateringRecord(
  wateringRecordId: number,
): Promise<void> {
  const { error } = await supabase
    .from('watering_history')
    .delete()
    .eq('id', wateringRecordId);

  if (error) {
    throw error;
  }
}