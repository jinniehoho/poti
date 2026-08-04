export type PlantCatalogEntityType =
  | 'species'
  | 'cultivar';

export type PlantCatalogRow = {
  catalog_id: string;
  entity_type: PlantCatalogEntityType;
  family_id: string;
  family_scientific_name: string;
  family_name_ko: string | null;
  family_name_en: string | null;
  family_name_de: string | null;
  genus_id: string;
  genus_scientific_name: string;
  species_id: string;
  species_scientific_name: string;
  species_name_ko: string | null;
  species_name_en: string | null;
  species_name_de: string | null;
  cultivar_id: string | null;
  cultivar_name: string | null;
  display_name_ko: string;
  display_name_en: string;
  display_name_de: string;
  effective_light_level: string | null;
  effective_watering_min_days: number | null;
  effective_watering_max_days: number | null;
  effective_humidity_min: number | null;
  effective_humidity_max: number | null;
  effective_temperature_min_c: number | null;
  effective_temperature_max_c: number | null;
  effective_difficulty: string | null;
  effective_toxicity: string | null;
  effective_pet_toxic: boolean | null;
  effective_human_toxic: boolean | null;
  image_key: string | null;
  popularity_rank: number | null;
  review_status:
    | 'draft'
    | 'reviewed'
    | 'published'
    | 'rejected';
  is_active: boolean;
};

export type PlantCatalogItem = PlantCatalogRow & {
  displayName: string;
  requestedLanguage: 'ko' | 'en' | 'de';
};
