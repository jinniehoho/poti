-- Read-only checks for catalog translations and the legacy/taxonomy registration bridge.
select
  count(*) as published_species,
  count(*) filter (
    where default_name_ko is null or btrim(default_name_ko) = ''
  ) as missing_ko_names,
  count(*) filter (
    where default_name_en is null or btrim(default_name_en) = ''
  ) as missing_en_names,
  count(*) filter (
    where default_name_de is null or btrim(default_name_de) = ''
  ) as missing_de_names,
  count(*) filter (
    where description_ko is null or btrim(description_ko) = ''
  ) as missing_ko_descriptions,
  count(*) filter (
    where description_en is null or btrim(description_en) = ''
  ) as missing_en_descriptions,
  count(*) filter (
    where description_de is null or btrim(description_de) = ''
  ) as missing_de_descriptions
from public.plant_species
where is_active
  and review_status = 'published';

select
  count(*) as user_plants,
  count(*) filter (where plant_type_id is not null) as legacy_references,
  count(*) filter (where plant_species_id is not null) as taxonomy_references,
  count(*) filter (
    where plant_type_id is null
      and plant_species_id is null
  ) as missing_catalog_references
from public.plants;

select
  legacy.id,
  legacy.scientific_name,
  legacy.species_id,
  species.scientific_name as mapped_species
from public.plant_types legacy
left join public.plant_species species
  on species.id = legacy.species_id
order by legacy.id;

select
  count(*) as broken_legacy_foreign_keys
from public.plants plant
left join public.plant_types legacy
  on legacy.id = plant.plant_type_id
where plant.plant_type_id is not null
  and legacy.id is null;

select
  count(*) as broken_species_foreign_keys
from public.plants plant
left join public.plant_species species
  on species.id = plant.plant_species_id
where plant.plant_species_id is not null
  and species.id is null;

select
  count(*) as broken_cultivar_relationships
from public.plants plant
join public.plant_cultivars cultivar
  on cultivar.id = plant.plant_cultivar_id
where cultivar.species_id <> plant.plant_species_id;

select
  entity_type,
  count(*)
from public.plant_catalog
group by entity_type
order by entity_type;

with search_tests(query, locale) as (
  values
    ('몬스테라', 'ko'),
    ('Monstera', 'en'),
    ('Efeutute', 'de'),
    ('Bogenhanf', 'de'),
    ('Sansevieria', 'en'),
    ('Dracaena trifasciata', 'en'),
    ('Thai Constellation', 'en'),
    ('Pink Princess', 'en'),
    ('Basilikum', 'de'),
    ('Rosmarin', 'de')
),
search_results as (
  select
    test.query,
    test.locale,
    (
      select count(*)
      from public.search_plant_catalog(
        test.query,
        test.locale,
        10
      )
    ) as hits
  from search_tests test
)
select query, locale, hits
from search_results
order by query;
