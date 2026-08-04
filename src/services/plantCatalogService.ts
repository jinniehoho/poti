import type { AppLanguage } from '../preferences/LanguageContext';
import { supabase } from '../lib/supabase';
import type {
  PlantCatalogItem,
  PlantCatalogRow,
} from '../types/plantCatalog';

type SearchPlantCatalogOptions = {
  query?: string;
  language: AppLanguage;
  limit?: number;
};

const FEATURED_SPECIES = [
  'Monstera deliciosa',
  'Epipremnum aureum',
  'Dracaena trifasciata',
  'Zamioculcas zamiifolia',
] as const;

function getLocalizedDisplayName(
  row: PlantCatalogRow,
  language: AppLanguage,
) {
  if (language === 'ko') {
    return (
      row.display_name_ko ||
      row.display_name_en ||
      row.species_scientific_name
    );
  }

  if (language === 'de') {
    return (
      row.display_name_de ||
      row.display_name_en ||
      row.species_scientific_name
    );
  }

  return (
    row.display_name_en ||
    row.species_scientific_name
  );
}

function toCatalogItem(
  row: PlantCatalogRow,
  language: AppLanguage,
): PlantCatalogItem {
  return {
    ...row,
    displayName: getLocalizedDisplayName(
      row,
      language,
    ),
    requestedLanguage: language,
  };
}

export async function searchPlantCatalog({
  query = '',
  language,
  limit = 30,
}: SearchPlantCatalogOptions): Promise<
  PlantCatalogItem[]
> {
  const safeLimit = Math.min(
    Math.max(Math.trunc(limit), 1),
    100,
  );

  const { data, error } = await supabase.rpc(
    'search_plant_catalog',
    {
      search_query: query.trim(),
      search_locale: language,
      result_limit: safeLimit,
    },
  );

  if (error) {
    throw error;
  }

  return ((data ?? []) as PlantCatalogRow[]).map(
    (row) => toCatalogItem(row, language),
  );
}

export async function getFeaturedPlantCatalog(
  language: AppLanguage,
): Promise<PlantCatalogItem[]> {
  const { data, error } = await supabase
    .from('plant_catalog')
    .select('*')
    .eq('entity_type', 'species')
    .in(
      'species_scientific_name',
      [...FEATURED_SPECIES],
    );

  if (error) {
    throw error;
  }

  const rowsByScientificName = new Map(
    ((data ?? []) as PlantCatalogRow[]).map(
      (row) => [
        row.species_scientific_name,
        row,
      ],
    ),
  );

  return FEATURED_SPECIES.flatMap(
    (scientificName) => {
      const row =
        rowsByScientificName.get(scientificName);

      return row
        ? [toCatalogItem(row, language)]
        : [];
    },
  );
}
