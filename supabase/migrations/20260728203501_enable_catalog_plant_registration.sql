-- Additive bridge: legacy plants keep plant_type_id, new catalog plants use taxonomy UUIDs.
begin;

alter table public.plants
  add column if not exists plant_species_id uuid,
  add column if not exists plant_cultivar_id uuid;

alter table public.plants
  alter column plant_type_id drop not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plants'::regclass
      and conname = 'plants_plant_species_id_fkey'
  ) then
    alter table public.plants
      add constraint plants_plant_species_id_fkey
      foreign key (plant_species_id)
      references public.plant_species(id)
      on delete restrict;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plants'::regclass
      and conname = 'plants_plant_cultivar_id_fkey'
  ) then
    alter table public.plants
      add constraint plants_plant_cultivar_id_fkey
      foreign key (plant_cultivar_id)
      references public.plant_cultivars(id)
      on delete restrict;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plants'::regclass
      and conname = 'plants_catalog_reference_check'
  ) then
    alter table public.plants
      add constraint plants_catalog_reference_check
      check (
        plant_type_id is not null
        or plant_species_id is not null
      );
  end if;
end
$$;

create index if not exists idx_plants_plant_species_id
  on public.plants (plant_species_id)
  where plant_species_id is not null;

create index if not exists idx_plants_plant_cultivar_id
  on public.plants (plant_cultivar_id)
  where plant_cultivar_id is not null;

create or replace view public.v_plant_watering_status
with (security_invoker = true)
as
with last_watering as (
  select
    watering_history.plant_id,
    max(watering_history.watered_at) as last_watered_at
  from public.watering_history
  group by watering_history.plant_id
),
plant_schedule as (
  select
    plant.id as plant_id,
    plant.display_name,
    plant.plant_type_id,
    coalesce(
      nullif(cultivar.display_name_ko, ''),
      nullif(species.default_name_ko, ''),
      nullif(cultivar.display_name_en, ''),
      nullif(species.default_name_en, ''),
      translation.name,
      species.scientific_name,
      legacy.scientific_name
    )::varchar(100) as plant_type_name,
    coalesce(legacy.emoji, '🪴')::varchar(10) as emoji,
    plant.watering_mode,
    case
      when plant.watering_mode = 'custom' then
        coalesce(
          plant.custom_interval_days,
          legacy.default_interval_days,
          round((
            coalesce(
              (cultivar.care_override ->> 'watering_min_days')::integer,
              species.watering_min_days
            )
            +
            coalesce(
              (cultivar.care_override ->> 'watering_max_days')::integer,
              species.watering_max_days
            )
          ) / 2.0)::integer,
          7
        )
      else
        coalesce(
          legacy.default_interval_days,
          round((
            coalesce(
              (cultivar.care_override ->> 'watering_min_days')::integer,
              species.watering_min_days
            )
            +
            coalesce(
              (cultivar.care_override ->> 'watering_max_days')::integer,
              species.watering_max_days
            )
          ) / 2.0)::integer,
          7
        )
    end as interval_days,
    watering.last_watered_at,
    coalesce(watering.last_watered_at, plant.created_at) as schedule_start_at,
    coalesce(plant.plant_species_id, legacy.species_id) as plant_species_id,
    coalesce(plant.plant_cultivar_id, legacy.cultivar_id) as plant_cultivar_id,
    species.scientific_name as species_scientific_name,
    cultivar.cultivar_name,
    coalesce(
      nullif(cultivar.display_name_ko, ''),
      nullif(species.default_name_ko, ''),
      nullif(cultivar.display_name_en, ''),
      nullif(species.default_name_en, ''),
      species.scientific_name
    ) as catalog_name_ko,
    coalesce(
      nullif(cultivar.display_name_en, ''),
      nullif(species.default_name_en, ''),
      species.scientific_name
    ) as catalog_name_en,
    coalesce(
      nullif(cultivar.display_name_de, ''),
      nullif(species.default_name_de, ''),
      nullif(cultivar.display_name_en, ''),
      nullif(species.default_name_en, ''),
      species.scientific_name
    ) as catalog_name_de
  from public.plants plant
  left join public.plant_types legacy
    on legacy.id = plant.plant_type_id
  left join public.plant_type_translations translation
    on translation.plant_type_id = legacy.id
   and translation.language_code = 'ko'
  left join public.plant_species species
    on species.id = coalesce(
      plant.plant_species_id,
      legacy.species_id
    )
  left join public.plant_cultivars cultivar
    on cultivar.id = coalesce(
      plant.plant_cultivar_id,
      legacy.cultivar_id
    )
   and cultivar.species_id = species.id
  left join last_watering watering
    on watering.plant_id = plant.id
  where plant.is_active
)
select
  plant_id,
  display_name,
  plant_type_id,
  plant_type_name,
  emoji,
  watering_mode,
  interval_days,
  last_watered_at,
  schedule_start_at + make_interval(days => interval_days) as next_watering_at,
  (schedule_start_at + make_interval(days => interval_days))::date
    - current_date as days_until_watering,
  case
    when (
      schedule_start_at + make_interval(days => interval_days)
    )::date < current_date then 'overdue'
    when (
      schedule_start_at + make_interval(days => interval_days)
    )::date = current_date then 'due_today'
    else 'not_due'
  end as watering_status,
  plant_species_id,
  plant_cultivar_id,
  species_scientific_name,
  cultivar_name,
  catalog_name_ko,
  catalog_name_en,
  catalog_name_de
from plant_schedule;

revoke all on public.v_plant_watering_status from anon;
grant select on public.v_plant_watering_status to authenticated;

commit;
