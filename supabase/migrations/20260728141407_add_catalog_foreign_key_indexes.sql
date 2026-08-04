create index if not exists idx_plants_plant_type_id
  on public.plants (plant_type_id);

create index if not exists idx_plant_type_translations_language_code
  on public.plant_type_translations (language_code);
