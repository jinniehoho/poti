import type { PlantTypeOption } from '../components/PlantTypeCard';
import { supabase } from '../lib/supabase';

type PlantTypeRow = {
  id: number;
  scientific_name: string;
  emoji: string;
  default_interval_days: number;
  plant_type_translations: {
    name: string;
  }[];
};

export async function getPlantTypes(): Promise<PlantTypeOption[]> {
  const { data, error } = await supabase
    .from('plant_types')
    .select(`
      id,
      scientific_name,
      emoji,
      default_interval_days,
      plant_type_translations!inner (
        name
      )
    `)
    .eq('plant_type_translations.language_code', 'ko')
    .order('id');

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as PlantTypeRow[];

  return rows.map((row) => ({
    id: row.id,
    name:
      row.plant_type_translations[0]?.name ??
      row.scientific_name,
    scientificName: row.scientific_name,
    emoji: row.emoji,
    defaultIntervalDays: row.default_interval_days,
  }));
}