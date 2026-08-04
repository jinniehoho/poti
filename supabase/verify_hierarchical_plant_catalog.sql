-- Read-only verification for the hierarchical plant catalog migration.

-- 1. Marble Queen hierarchy.
select
  family_scientific_name,
  genus_scientific_name,
  species_scientific_name,
  cultivar_name
from public.plant_catalog
where cultivar_name = 'Marble Queen';

-- 2. Marble Queen inherits Epipremnum aureum care data.
select
  cultivar_name,
  effective_light_level,
  effective_watering_min_days,
  effective_watering_max_days,
  effective_humidity_min,
  effective_humidity_max
from public.plant_catalog
where cultivar_name = 'Marble Queen';

-- 3. Neon overrides only light_level; watering remains inherited.
select
  cultivar_name,
  effective_light_level,
  effective_watering_min_days,
  effective_watering_max_days
from public.plant_catalog
where cultivar_name = 'Neon';

-- 4-10. Multilingual aliases and scientific names.
select '스킨답서스' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('스킨답서스', 'ko', 5);
select '포토스' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('포토스', 'ko', 5);
select 'Pothos' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Pothos', 'en', 5);
select 'Efeutute' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Efeutute', 'de', 5);
select '산세베리아' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('산세베리아', 'ko', 5);
select 'Sansevieria trifasciata' as query, catalog_id, entity_type
from public.search_plant_catalog('Sansevieria trifasciata', 'en', 5);
select 'Dracaena trifasciata' as query, catalog_id, entity_type
from public.search_plant_catalog('Dracaena trifasciata', 'en', 5);

-- 11-12 are verified transactionally without keeping the temporary row.
begin;
select private.create_plant_cultivar(
  (
    select id
    from public.plant_species
    where scientific_name = 'Epipremnum aureum'
  ),
  'Verification Only',
  null,
  'Verification Only',
  null,
  null,
  '{"watering_min_days":10,"watering_max_days":14}'::jsonb,
  '[{"locale":"en","term":"Verification Only","term_type":"cultivar_name"}]'::jsonb
);
select
  family_scientific_name,
  genus_scientific_name,
  species_scientific_name,
  cultivar_name,
  effective_watering_min_days,
  effective_watering_max_days
from public.plant_catalog
where cultivar_name = 'Verification Only';
select catalog_id, cultivar_name
from public.search_plant_catalog('Verification Only', 'en', 5);
rollback;

-- 13. German fallback to English for a temporary missing translation.
begin;
update public.plant_cultivars
set display_name_de = null
where cultivar_name = 'Marble Queen';
select cultivar_name, display_name_de
from public.plant_catalog
where cultivar_name = 'Marble Queen';
rollback;

-- 14. Inactive rows disappear from the public catalog view.
begin;
update public.plant_cultivars
set is_active = false
where cultivar_name = 'Marble Queen';
select count(*) as inactive_visible_count
from public.plant_catalog
where cultivar_name = 'Marble Queen';
rollback;

-- Existing IDs and compatibility mapping stay intact.
select
  plant_type_id,
  legacy_scientific_name,
  catalog_id,
  species_scientific_name
from public.plant_type_catalog_compatibility
order by plant_type_id;
