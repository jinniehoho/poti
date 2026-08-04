-- Read-only post-migration verification.

select
  (select count(*) from public.plant_families) as family_count,
  (select count(*) from public.plant_genera) as genus_count,
  (select count(*) from public.plant_species) as species_count,
  (select count(*) from public.plant_cultivars) as cultivar_count,
  (select count(*) from public.plant_search_terms) as search_term_count,
  (
    select count(*)
    from public.plant_species
    where review_status = 'published'
  ) as published_species_count,
  (
    select count(*)
    from public.plant_species
    where is_active
  ) as active_species_count;

select
  family.scientific_name as family_scientific_name,
  count(*) as species_count
from public.plant_species species
join public.plant_genera genus
  on genus.id = species.genus_id
join public.plant_families family
  on family.id = genus.family_id
group by family.scientific_name
order by species_count desc, family.scientific_name;

select scientific_name, count(*)
from public.plant_species
group by scientific_name
having count(*) > 1;

select scientific_name, count(*)
from public.plant_genera
group by scientific_name
having count(*) > 1;

select species_id, cultivar_name, count(*)
from public.plant_cultivars
group by species_id, cultivar_name
having count(*) > 1;

select
  coalesce(species_id, cultivar_id) as entity_id,
  locale,
  normalized_term,
  count(*)
from public.plant_search_terms
group by
  coalesce(species_id, cultivar_id),
  locale,
  normalized_term
having count(*) > 1;

select species.scientific_name
from public.plant_species species
left join public.plant_genera genus
  on genus.id = species.genus_id
left join public.plant_families family
  on family.id = genus.family_id
where genus.id is null
   or family.id is null;

select scientific_name
from public.plant_species
where watering_min_days > watering_max_days
   or humidity_min > humidity_max
   or temperature_min_c > temperature_max_c
   or humidity_min not between 0 and 100
   or humidity_max not between 0 and 100
   or watering_min_days < 2
   or watering_max_days > 45;

select scientific_name
from public.plant_species
where default_name_ko is null
   or default_name_en is null
   or default_name_de is null
   or description_ko is null
   or description_en is null
   or description_de is null
order by scientific_name;

select
  (
    select count(*)
    from public.plant_species
    where toxicity = 'not_known_toxic'
      and (pet_toxic is true or human_toxic is true)
  ) as non_toxic_boolean_conflicts,
  (
    select count(*)
    from public.plant_species
    where toxicity = 'review_required'
      and (pet_toxic is not null or human_toxic is not null)
  ) as uncertain_toxicity_conflicts;

select
  species.scientific_name as owner,
  synonym.term as synonym,
  other_species.scientific_name as colliding_species
from public.plant_species species
cross join lateral unnest(species.synonyms) as synonym(term)
join public.plant_species other_species
  on lower(other_species.scientific_name) = lower(synonym.term)
 and other_species.id <> species.id;

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
  (select count(*) from public.plant_types) as legacy_type_count,
  (select count(*) from public.plants) as user_plant_count,
  (
    select count(*)
    from public.plants plant
    left join public.plant_types plant_type
      on plant_type.id = plant.plant_type_id
    where plant_type.id is null
  ) as broken_legacy_foreign_keys;

select '몬스테라' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('몬스테라', 'ko', 5);
select 'Monstera' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Monstera', 'en', 5);
select 'Monstera deliciosa' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Monstera deliciosa', 'en', 5);
select '스킨답서스' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('스킨답서스', 'ko', 5);
select '포토스' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('포토스', 'ko', 5);
select 'Pothos' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Pothos', 'en', 5);
select 'Efeutute' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Efeutute', 'de', 5);
select 'Epipremnum aureum' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Epipremnum aureum', 'en', 5);
select '산세베리아' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('산세베리아', 'ko', 5);
select 'Snake plant' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Snake plant', 'en', 5);
select 'Bogenhanf' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Bogenhanf', 'de', 5);
select 'Sansevieria trifasciata' as query, catalog_id, entity_type
from public.search_plant_catalog('Sansevieria trifasciata', 'en', 5);
select 'Dracaena trifasciata' as query, catalog_id, entity_type
from public.search_plant_catalog('Dracaena trifasciata', 'en', 5);
select '고무나무' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('고무나무', 'ko', 5);
select 'Rubber plant' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Rubber plant', 'en', 5);
select 'Gummibaum' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Gummibaum', 'de', 5);
select 'Ficus elastica' as query, catalog_id, entity_type
from public.search_plant_catalog('Ficus elastica', 'en', 5);
select '필로덴드론' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('필로덴드론', 'ko', 10);
select 'Philodendron' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Philodendron', 'en', 10);
select 'Philodendron hederaceum' as query, catalog_id, entity_type
from public.search_plant_catalog('Philodendron hederaceum', 'en', 5);
select '알로에' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('알로에', 'ko', 5);
select 'Aloe vera' as query, catalog_id, entity_type
from public.search_plant_catalog('Aloe vera', 'en', 5);
select '바질' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('바질', 'ko', 5);
select 'Basil' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Basil', 'en', 5);
select 'Basilikum' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Basilikum', 'de', 5);
select 'Ocimum basilicum' as query, catalog_id, entity_type
from public.search_plant_catalog('Ocimum basilicum', 'en', 5);
select '로즈마리' as query, catalog_id, entity_type, display_name_ko
from public.search_plant_catalog('로즈마리', 'ko', 5);
select 'Rosemary' as query, catalog_id, entity_type, display_name_en
from public.search_plant_catalog('Rosemary', 'en', 5);
select 'Rosmarin' as query, catalog_id, entity_type, display_name_de
from public.search_plant_catalog('Rosmarin', 'de', 5);
select 'Salvia rosmarinus' as query, catalog_id, entity_type
from public.search_plant_catalog('Salvia rosmarinus', 'en', 5);

select
  catalog.family_scientific_name,
  catalog.genus_scientific_name,
  catalog.species_scientific_name,
  catalog.cultivar_name,
  catalog.effective_watering_min_days,
  catalog.effective_watering_max_days
from public.plant_catalog catalog
where catalog.cultivar_name in (
  'Brasil',
  'Pink Princess',
  'Triostar'
)
order by catalog.cultivar_name;
