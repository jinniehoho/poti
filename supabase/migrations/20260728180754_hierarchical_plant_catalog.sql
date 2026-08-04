-- Additive, backwards-compatible plant catalog migration.
-- Existing plant_types rows, plants rows, IDs, and foreign keys are preserved.

begin;

create schema if not exists private;
create schema if not exists extensions;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;

create or replace function public.normalize_plant_search_term(input text)
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select regexp_replace(
    lower(extensions.unaccent(coalesce(input, ''))),
    '[[:space:]''’‘`´‐‑‒–—-]+',
    '',
    'g'
  );
$$;

revoke all on function public.normalize_plant_search_term(text) from public;
grant execute on function public.normalize_plant_search_term(text)
  to anon, authenticated, service_role;

create or replace function private.is_valid_plant_care_override(value jsonb)
returns boolean
language plpgsql
immutable
security invoker
set search_path = ''
as $$
declare
  override_key text;
begin
  if value is null then
    return true;
  end if;

  if jsonb_typeof(value) <> 'object' then
    return false;
  end if;

  for override_key in
    select jsonb_object_keys(value)
  loop
    if override_key not in (
      'light_level',
      'light_min',
      'light_max',
      'watering_min_days',
      'watering_max_days',
      'humidity_min',
      'humidity_max',
      'temperature_min_c',
      'temperature_max_c',
      'difficulty',
      'toxicity',
      'pet_toxic',
      'human_toxic'
    ) then
      return false;
    end if;
  end loop;

  if exists (
    select 1
    from jsonb_each(value) as item(key, item_value)
    where (
      item.key in (
        'light_min',
        'light_max',
        'watering_min_days',
        'watering_max_days',
        'humidity_min',
        'humidity_max',
        'temperature_min_c',
        'temperature_max_c'
      )
      and jsonb_typeof(item.item_value) <> 'number'
    )
    or (
      item.key in ('pet_toxic', 'human_toxic')
      and jsonb_typeof(item.item_value) <> 'boolean'
    )
    or (
      item.key in ('light_level', 'difficulty', 'toxicity')
      and jsonb_typeof(item.item_value) <> 'string'
    )
  ) then
    return false;
  end if;

  if value ? 'light_min'
     and ((value ->> 'light_min')::integer < 0
       or (value ->> 'light_min')::integer > 100) then
    return false;
  end if;

  if value ? 'light_max'
     and ((value ->> 'light_max')::integer < 0
       or (value ->> 'light_max')::integer > 100) then
    return false;
  end if;

  if value ? 'humidity_min'
     and ((value ->> 'humidity_min')::integer < 0
       or (value ->> 'humidity_min')::integer > 100) then
    return false;
  end if;

  if value ? 'humidity_max'
     and ((value ->> 'humidity_max')::integer < 0
       or (value ->> 'humidity_max')::integer > 100) then
    return false;
  end if;

  if value ? 'watering_min_days'
     and (value ->> 'watering_min_days')::integer < 1 then
    return false;
  end if;

  if value ? 'watering_max_days'
     and (value ->> 'watering_max_days')::integer < 1 then
    return false;
  end if;

  if value ? 'light_min'
     and value ? 'light_max'
     and (value ->> 'light_min')::integer
       > (value ->> 'light_max')::integer then
    return false;
  end if;

  if value ? 'humidity_min'
     and value ? 'humidity_max'
     and (value ->> 'humidity_min')::integer
       > (value ->> 'humidity_max')::integer then
    return false;
  end if;

  if value ? 'watering_min_days'
     and value ? 'watering_max_days'
     and (value ->> 'watering_min_days')::integer
       > (value ->> 'watering_max_days')::integer then
    return false;
  end if;

  if value ? 'temperature_min_c'
     and value ? 'temperature_max_c'
     and (value ->> 'temperature_min_c')::numeric
       > (value ->> 'temperature_max_c')::numeric then
    return false;
  end if;

  return true;
exception
  when others then
    return false;
end;
$$;

revoke all on function private.is_valid_plant_care_override(jsonb)
  from public;
grant execute on function private.is_valid_plant_care_override(jsonb)
  to service_role;

create table if not exists public.plant_families (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null unique,
  name_ko text,
  name_en text,
  name_de text,
  description text,
  review_status text not null default 'draft'
    check (review_status in ('draft', 'reviewed', 'published', 'rejected')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plant_genera (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null
    references public.plant_families(id) on delete restrict,
  scientific_name text not null unique,
  name_ko text,
  name_en text,
  name_de text,
  description text,
  review_status text not null default 'draft'
    check (review_status in ('draft', 'reviewed', 'published', 'rejected')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plant_species (
  id uuid primary key default gen_random_uuid(),
  genus_id uuid not null
    references public.plant_genera(id) on delete restrict,
  scientific_name text not null unique,
  specific_epithet text not null,
  accepted_scientific_name text,
  taxonomic_status text,
  synonyms text[] not null default '{}',
  default_name_ko text,
  default_name_en text,
  default_name_de text,
  description_ko text,
  description_en text,
  description_de text,
  light_level text,
  light_min integer check (light_min between 0 and 100),
  light_max integer check (light_max between 0 and 100),
  watering_min_days integer check (watering_min_days > 0),
  watering_max_days integer check (watering_max_days > 0),
  humidity_min integer check (humidity_min between 0 and 100),
  humidity_max integer check (humidity_max between 0 and 100),
  temperature_min_c numeric,
  temperature_max_c numeric,
  difficulty text,
  toxicity text,
  pet_toxic boolean,
  human_toxic boolean,
  image_key text,
  popularity_rank integer check (popularity_rank >= 0),
  review_status text not null default 'draft'
    check (review_status in ('draft', 'reviewed', 'published', 'rejected')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plant_species_scientific_name_format_check
    check (scientific_name ~ '^[[:alpha:]-]+[[:space:]]+[[:alpha:]-]+'),
  constraint plant_species_light_range_check
    check (light_min is null or light_max is null or light_min <= light_max),
  constraint plant_species_watering_range_check
    check (
      watering_min_days is null
      or watering_max_days is null
      or watering_min_days <= watering_max_days
    ),
  constraint plant_species_humidity_range_check
    check (
      humidity_min is null
      or humidity_max is null
      or humidity_min <= humidity_max
    ),
  constraint plant_species_temperature_range_check
    check (
      temperature_min_c is null
      or temperature_max_c is null
      or temperature_min_c <= temperature_max_c
    )
);

create table if not exists public.plant_cultivars (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null
    references public.plant_species(id) on delete restrict,
  cultivar_name text not null,
  display_name_ko text,
  display_name_en text,
  display_name_de text,
  description_ko text,
  description_en text,
  description_de text,
  image_key text,
  popularity_rank integer check (popularity_rank >= 0),
  review_status text not null default 'draft'
    check (review_status in ('draft', 'reviewed', 'published', 'rejected')),
  is_active boolean not null default true,
  care_override jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plant_cultivars_species_name_key
    unique (species_id, cultivar_name),
  constraint plant_cultivars_care_override_check
    check (private.is_valid_plant_care_override(care_override))
);

create table if not exists public.plant_search_terms (
  id uuid primary key default gen_random_uuid(),
  species_id uuid
    references public.plant_species(id) on delete restrict,
  cultivar_id uuid
    references public.plant_cultivars(id) on delete restrict,
  locale text not null
    check (locale in ('ko', 'en', 'de', 'la')),
  term text not null check (btrim(term) <> ''),
  normalized_term text not null,
  term_type text not null
    check (
      term_type in (
        'primary',
        'common_name',
        'alias',
        'scientific_name',
        'synonym',
        'cultivar_name'
      )
    ),
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  constraint plant_search_terms_single_target_check
    check ((species_id is null) <> (cultivar_id is null))
);

create index if not exists idx_plant_genera_family_id
  on public.plant_genera(family_id);
create index if not exists idx_plant_species_genus_id
  on public.plant_species(genus_id);
create index if not exists idx_plant_cultivars_species_id
  on public.plant_cultivars(species_id);
create index if not exists idx_plant_species_published_popularity
  on public.plant_species(popularity_rank desc)
  where is_active and review_status = 'published';
create index if not exists idx_plant_cultivars_published_popularity
  on public.plant_cultivars(popularity_rank desc)
  where is_active and review_status = 'published';
create index if not exists idx_plant_search_terms_species_id
  on public.plant_search_terms(species_id)
  where species_id is not null;
create index if not exists idx_plant_search_terms_cultivar_id
  on public.plant_search_terms(cultivar_id)
  where cultivar_id is not null;
create unique index if not exists uq_plant_search_terms_species
  on public.plant_search_terms(
    species_id,
    locale,
    normalized_term,
    term_type
  )
  where species_id is not null;
create unique index if not exists uq_plant_search_terms_cultivar
  on public.plant_search_terms(
    cultivar_id,
    locale,
    normalized_term,
    term_type
  )
  where cultivar_id is not null;
create index if not exists idx_plant_search_terms_normalized_trgm
  on public.plant_search_terms
  using gin (normalized_term extensions.gin_trgm_ops);

drop trigger if exists set_plant_families_updated_at
  on public.plant_families;
create trigger set_plant_families_updated_at
before update on public.plant_families
for each row execute function private.set_updated_at();

drop trigger if exists set_plant_genera_updated_at
  on public.plant_genera;
create trigger set_plant_genera_updated_at
before update on public.plant_genera
for each row execute function private.set_updated_at();

drop trigger if exists set_plant_species_updated_at
  on public.plant_species;
create trigger set_plant_species_updated_at
before update on public.plant_species
for each row execute function private.set_updated_at();

drop trigger if exists set_plant_cultivars_updated_at
  on public.plant_cultivars;
create trigger set_plant_cultivars_updated_at
before update on public.plant_cultivars
for each row execute function private.set_updated_at();

create or replace function private.normalize_plant_search_term_trigger()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.normalized_term =
    public.normalize_plant_search_term(new.term);
  return new;
end;
$$;

revoke all on function private.normalize_plant_search_term_trigger()
  from public;
grant execute on function private.normalize_plant_search_term_trigger()
  to service_role;

drop trigger if exists normalize_plant_search_term
  on public.plant_search_terms;
create trigger normalize_plant_search_term
before insert or update of term
on public.plant_search_terms
for each row
execute function private.normalize_plant_search_term_trigger();

-- Seed a deliberately small validation catalog.
insert into public.plant_families (
  scientific_name,
  name_ko,
  name_en,
  name_de,
  review_status
)
values
  ('Araceae', '천남성과', 'Arum family', 'Aronstabgewächse', 'published'),
  ('Asparagaceae', '비짜루과', 'Asparagus family', 'Spargelgewächse', 'published'),
  ('Moraceae', '뽕나무과', 'Mulberry family', 'Maulbeergewächse', 'published')
on conflict (scientific_name) do nothing;

insert into public.plant_genera (
  family_id,
  scientific_name,
  review_status
)
select family.id, seed.scientific_name, 'published'
from (
  values
    ('Araceae', 'Monstera'),
    ('Araceae', 'Epipremnum'),
    ('Asparagaceae', 'Dracaena'),
    ('Moraceae', 'Ficus')
) as seed(family_scientific_name, scientific_name)
join public.plant_families family
  on family.scientific_name = seed.family_scientific_name
on conflict (scientific_name) do nothing;

insert into public.plant_species (
  genus_id,
  scientific_name,
  specific_epithet,
  accepted_scientific_name,
  taxonomic_status,
  synonyms,
  default_name_ko,
  default_name_en,
  default_name_de,
  light_level,
  light_min,
  light_max,
  watering_min_days,
  watering_max_days,
  humidity_min,
  humidity_max,
  temperature_min_c,
  temperature_max_c,
  difficulty,
  toxicity,
  pet_toxic,
  human_toxic,
  image_key,
  popularity_rank,
  review_status
)
select
  genus.id,
  seed.scientific_name,
  seed.specific_epithet,
  seed.accepted_scientific_name,
  seed.taxonomic_status,
  seed.synonyms,
  seed.default_name_ko,
  seed.default_name_en,
  seed.default_name_de,
  seed.light_level,
  seed.light_min,
  seed.light_max,
  seed.watering_min_days,
  seed.watering_max_days,
  seed.humidity_min,
  seed.humidity_max,
  seed.temperature_min_c,
  seed.temperature_max_c,
  seed.difficulty,
  seed.toxicity,
  seed.pet_toxic,
  seed.human_toxic,
  seed.image_key,
  seed.popularity_rank,
  'published'
from (
  values
    (
      'Monstera',
      'Monstera deliciosa',
      'deliciosa',
      'Monstera deliciosa',
      'accepted',
      array[]::text[],
      '몬스테라',
      'Monstera',
      'Fensterblatt',
      'bright_indirect',
      60,
      90,
      7,
      10,
      50,
      70,
      18::numeric,
      30::numeric,
      'easy',
      'irritant',
      true,
      true,
      'monstera-deliciosa',
      100
    ),
    (
      'Epipremnum',
      'Epipremnum aureum',
      'aureum',
      'Epipremnum aureum',
      'accepted',
      array[]::text[],
      '스킨답서스',
      'Pothos',
      'Efeutute',
      'medium_indirect',
      40,
      80,
      7,
      10,
      40,
      70,
      18::numeric,
      29::numeric,
      'easy',
      'toxic_if_ingested',
      true,
      true,
      'epipremnum-aureum',
      95
    ),
    (
      'Dracaena',
      'Dracaena trifasciata',
      'trifasciata',
      'Dracaena trifasciata',
      'accepted',
      array['Sansevieria trifasciata']::text[],
      '산세베리아',
      'Snake Plant',
      'Bogenhanf',
      'low_to_bright_indirect',
      20,
      90,
      14,
      21,
      30,
      60,
      15::numeric,
      30::numeric,
      'easy',
      'toxic_if_ingested',
      true,
      false,
      'dracaena-trifasciata',
      90
    ),
    (
      'Ficus',
      'Ficus elastica',
      'elastica',
      'Ficus elastica',
      'accepted',
      array[]::text[],
      '고무나무',
      'Rubber Plant',
      'Gummibaum',
      'bright_indirect',
      60,
      90,
      7,
      14,
      40,
      60,
      16::numeric,
      29::numeric,
      'medium',
      'irritant_sap',
      true,
      true,
      'ficus-elastica',
      85
    )
) as seed(
  genus_scientific_name,
  scientific_name,
  specific_epithet,
  accepted_scientific_name,
  taxonomic_status,
  synonyms,
  default_name_ko,
  default_name_en,
  default_name_de,
  light_level,
  light_min,
  light_max,
  watering_min_days,
  watering_max_days,
  humidity_min,
  humidity_max,
  temperature_min_c,
  temperature_max_c,
  difficulty,
  toxicity,
  pet_toxic,
  human_toxic,
  image_key,
  popularity_rank
)
join public.plant_genera genus
  on genus.scientific_name = seed.genus_scientific_name
on conflict (scientific_name) do nothing;

insert into public.plant_cultivars (
  species_id,
  cultivar_name,
  display_name_ko,
  display_name_en,
  display_name_de,
  image_key,
  popularity_rank,
  review_status,
  care_override
)
select
  species.id,
  seed.cultivar_name,
  seed.display_name_ko,
  seed.display_name_en,
  seed.display_name_de,
  seed.image_key,
  seed.popularity_rank,
  'published',
  seed.care_override
from (
  values
    ('Monstera deliciosa', 'Thai Constellation', '타이 컨스텔레이션', 'Thai Constellation', 'Thai Constellation', 'monstera-deliciosa-thai-constellation', 84, null::jsonb),
    ('Monstera deliciosa', 'Albo Variegata', '알보 바리에가타', 'Albo Variegata', 'Albo Variegata', 'monstera-deliciosa-albo-variegata', 82, null::jsonb),
    ('Epipremnum aureum', 'Golden Pothos', '골든 포토스', 'Golden Pothos', 'Goldene Efeutute', 'epipremnum-aureum-golden-pothos', 80, null::jsonb),
    ('Epipremnum aureum', 'Marble Queen', '마블 퀸', 'Marble Queen', 'Marble Queen', 'epipremnum-aureum-marble-queen', 79, null::jsonb),
    ('Epipremnum aureum', 'Neon', '네온', 'Neon', 'Neon', 'epipremnum-aureum-neon', 78, '{"light_level":"bright_indirect"}'::jsonb),
    ('Epipremnum aureum', 'N''Joy', '엔조이', 'N''Joy', 'N''Joy', 'epipremnum-aureum-njoy', 77, null::jsonb),
    ('Epipremnum aureum', 'Manjula', '만줄라', 'Manjula', 'Manjula', 'epipremnum-aureum-manjula', 76, null::jsonb),
    ('Dracaena trifasciata', 'Laurentii', '라우렌티', 'Laurentii', 'Laurentii', 'dracaena-trifasciata-laurentii', 75, null::jsonb),
    ('Dracaena trifasciata', 'Moonshine', '문샤인', 'Moonshine', 'Moonshine', 'dracaena-trifasciata-moonshine', 74, null::jsonb),
    ('Dracaena trifasciata', 'Hahnii', '하니', 'Hahnii', 'Hahnii', 'dracaena-trifasciata-hahnii', 73, null::jsonb),
    ('Ficus elastica', 'Burgundy', '버건디', 'Burgundy', 'Burgundy', 'ficus-elastica-burgundy', 72, null::jsonb),
    ('Ficus elastica', 'Tineke', '티네케', 'Tineke', 'Tineke', 'ficus-elastica-tineke', 71, null::jsonb),
    ('Ficus elastica', 'Ruby', '루비', 'Ruby', 'Ruby', 'ficus-elastica-ruby', 70, null::jsonb)
) as seed(
  species_scientific_name,
  cultivar_name,
  display_name_ko,
  display_name_en,
  display_name_de,
  image_key,
  popularity_rank,
  care_override
)
join public.plant_species species
  on species.scientific_name = seed.species_scientific_name
on conflict (species_id, cultivar_name) do nothing;

insert into public.plant_search_terms (
  species_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  species.id,
  seed.locale,
  seed.term,
  seed.term,
  seed.term_type,
  seed.priority
from (
  values
    ('Monstera deliciosa', 'ko', '몬스테라', 'primary', 100),
    ('Monstera deliciosa', 'en', 'Monstera', 'common_name', 95),
    ('Monstera deliciosa', 'de', 'Fensterblatt', 'common_name', 95),
    ('Monstera deliciosa', 'la', 'Monstera deliciosa', 'scientific_name', 100),
    ('Epipremnum aureum', 'ko', '스킨답서스', 'primary', 100),
    ('Epipremnum aureum', 'ko', '포토스', 'alias', 90),
    ('Epipremnum aureum', 'en', 'Pothos', 'common_name', 100),
    ('Epipremnum aureum', 'en', 'Golden Pothos', 'common_name', 90),
    ('Epipremnum aureum', 'de', 'Efeutute', 'common_name', 100),
    ('Epipremnum aureum', 'la', 'Epipremnum aureum', 'scientific_name', 100),
    ('Dracaena trifasciata', 'ko', '산세베리아', 'primary', 100),
    ('Dracaena trifasciata', 'en', 'Snake Plant', 'common_name', 100),
    ('Dracaena trifasciata', 'de', 'Bogenhanf', 'common_name', 100),
    ('Dracaena trifasciata', 'la', 'Dracaena trifasciata', 'scientific_name', 100),
    ('Dracaena trifasciata', 'la', 'Sansevieria trifasciata', 'synonym', 100),
    ('Ficus elastica', 'ko', '고무나무', 'primary', 100),
    ('Ficus elastica', 'en', 'Rubber Plant', 'common_name', 100),
    ('Ficus elastica', 'de', 'Gummibaum', 'common_name', 100),
    ('Ficus elastica', 'la', 'Ficus elastica', 'scientific_name', 100)
) as seed(
  species_scientific_name,
  locale,
  term,
  term_type,
  priority
)
join public.plant_species species
  on species.scientific_name = seed.species_scientific_name
on conflict do nothing;

insert into public.plant_search_terms (
  cultivar_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  cultivar.id,
  seed.locale,
  seed.term,
  seed.term,
  'cultivar_name',
  seed.priority
from (
  values
    ('Monstera deliciosa', 'Thai Constellation', 'ko', '타이 컨스텔레이션', 100),
    ('Monstera deliciosa', 'Thai Constellation', 'en', 'Thai Constellation', 100),
    ('Monstera deliciosa', 'Albo Variegata', 'ko', '알보 바리에가타', 100),
    ('Monstera deliciosa', 'Albo Variegata', 'en', 'Albo Variegata', 100),
    ('Epipremnum aureum', 'Golden Pothos', 'ko', '골든 포토스', 100),
    ('Epipremnum aureum', 'Golden Pothos', 'en', 'Golden Pothos', 100),
    ('Epipremnum aureum', 'Marble Queen', 'ko', '마블 퀸', 100),
    ('Epipremnum aureum', 'Marble Queen', 'en', 'Marble Queen', 100),
    ('Epipremnum aureum', 'Neon', 'ko', '네온', 100),
    ('Epipremnum aureum', 'Neon', 'en', 'Neon', 100),
    ('Epipremnum aureum', 'N''Joy', 'ko', '엔조이', 100),
    ('Epipremnum aureum', 'N''Joy', 'en', 'N''Joy', 100),
    ('Epipremnum aureum', 'Manjula', 'ko', '만줄라', 100),
    ('Epipremnum aureum', 'Manjula', 'en', 'Manjula', 100),
    ('Dracaena trifasciata', 'Laurentii', 'en', 'Laurentii', 100),
    ('Dracaena trifasciata', 'Moonshine', 'en', 'Moonshine', 100),
    ('Dracaena trifasciata', 'Hahnii', 'en', 'Hahnii', 100),
    ('Ficus elastica', 'Burgundy', 'en', 'Burgundy', 100),
    ('Ficus elastica', 'Tineke', 'en', 'Tineke', 100),
    ('Ficus elastica', 'Ruby', 'en', 'Ruby', 100)
) as seed(
  species_scientific_name,
  cultivar_name,
  locale,
  term,
  priority
)
join public.plant_species species
  on species.scientific_name = seed.species_scientific_name
join public.plant_cultivars cultivar
  on cultivar.species_id = species.id
 and cultivar.cultivar_name = seed.cultivar_name
on conflict do nothing;

-- Preserve the legacy table and attach it to the new catalog.
alter table public.plant_types
  add column if not exists species_id uuid
    references public.plant_species(id) on delete restrict,
  add column if not exists cultivar_id uuid
    references public.plant_cultivars(id) on delete restrict;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plant_types'::regclass
      and conname = 'plant_types_single_catalog_target_check'
  ) then
    alter table public.plant_types
      add constraint plant_types_single_catalog_target_check
      check (not (species_id is not null and cultivar_id is not null));
  end if;
end;
$$;

create index if not exists idx_plant_types_species_id
  on public.plant_types(species_id)
  where species_id is not null;
create index if not exists idx_plant_types_cultivar_id
  on public.plant_types(cultivar_id)
  where cultivar_id is not null;

update public.plant_types legacy
set
  species_id = species.id,
  cultivar_id = null
from public.plant_species species
where legacy.species_id is null
  and (
    legacy.scientific_name = species.scientific_name
    or (
      legacy.scientific_name = 'Sansevieria trifasciata'
      and species.scientific_name = 'Dracaena trifasciata'
    )
  );

create or replace view public.plant_catalog
with (security_invoker = true)
as
select
  'species:' || species.id::text as catalog_id,
  'species'::text as entity_type,
  family.id as family_id,
  family.scientific_name as family_scientific_name,
  family.name_ko as family_name_ko,
  family.name_en as family_name_en,
  family.name_de as family_name_de,
  genus.id as genus_id,
  genus.scientific_name as genus_scientific_name,
  species.id as species_id,
  species.scientific_name as species_scientific_name,
  species.default_name_ko as species_name_ko,
  species.default_name_en as species_name_en,
  species.default_name_de as species_name_de,
  null::uuid as cultivar_id,
  null::text as cultivar_name,
  coalesce(
    nullif(species.default_name_ko, ''),
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_ko,
  coalesce(
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_en,
  coalesce(
    nullif(species.default_name_de, ''),
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_de,
  species.light_level as effective_light_level,
  species.watering_min_days as effective_watering_min_days,
  species.watering_max_days as effective_watering_max_days,
  species.humidity_min as effective_humidity_min,
  species.humidity_max as effective_humidity_max,
  species.temperature_min_c as effective_temperature_min_c,
  species.temperature_max_c as effective_temperature_max_c,
  species.difficulty as effective_difficulty,
  species.toxicity as effective_toxicity,
  species.pet_toxic as effective_pet_toxic,
  species.human_toxic as effective_human_toxic,
  species.image_key,
  species.popularity_rank,
  species.review_status,
  species.is_active
from public.plant_species species
join public.plant_genera genus
  on genus.id = species.genus_id
join public.plant_families family
  on family.id = genus.family_id
where species.is_active
  and species.review_status = 'published'
  and genus.is_active
  and genus.review_status = 'published'
  and family.is_active
  and family.review_status = 'published'

union all

select
  'cultivar:' || cultivar.id::text as catalog_id,
  'cultivar'::text as entity_type,
  family.id as family_id,
  family.scientific_name as family_scientific_name,
  family.name_ko as family_name_ko,
  family.name_en as family_name_en,
  family.name_de as family_name_de,
  genus.id as genus_id,
  genus.scientific_name as genus_scientific_name,
  species.id as species_id,
  species.scientific_name as species_scientific_name,
  species.default_name_ko as species_name_ko,
  species.default_name_en as species_name_en,
  species.default_name_de as species_name_de,
  cultivar.id as cultivar_id,
  cultivar.cultivar_name,
  coalesce(
    nullif(cultivar.display_name_ko, ''),
    nullif(cultivar.display_name_en, ''),
    nullif(cultivar.cultivar_name, ''),
    nullif(species.default_name_ko, ''),
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_ko,
  coalesce(
    nullif(cultivar.display_name_en, ''),
    nullif(cultivar.cultivar_name, ''),
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_en,
  coalesce(
    nullif(cultivar.display_name_de, ''),
    nullif(cultivar.display_name_en, ''),
    nullif(cultivar.cultivar_name, ''),
    nullif(species.default_name_de, ''),
    nullif(species.default_name_en, ''),
    species.scientific_name
  ) as display_name_de,
  coalesce(
    nullif(cultivar.care_override ->> 'light_level', ''),
    species.light_level
  ) as effective_light_level,
  coalesce(
    (cultivar.care_override ->> 'watering_min_days')::integer,
    species.watering_min_days
  ) as effective_watering_min_days,
  coalesce(
    (cultivar.care_override ->> 'watering_max_days')::integer,
    species.watering_max_days
  ) as effective_watering_max_days,
  coalesce(
    (cultivar.care_override ->> 'humidity_min')::integer,
    species.humidity_min
  ) as effective_humidity_min,
  coalesce(
    (cultivar.care_override ->> 'humidity_max')::integer,
    species.humidity_max
  ) as effective_humidity_max,
  coalesce(
    (cultivar.care_override ->> 'temperature_min_c')::numeric,
    species.temperature_min_c
  ) as effective_temperature_min_c,
  coalesce(
    (cultivar.care_override ->> 'temperature_max_c')::numeric,
    species.temperature_max_c
  ) as effective_temperature_max_c,
  coalesce(
    nullif(cultivar.care_override ->> 'difficulty', ''),
    species.difficulty
  ) as effective_difficulty,
  coalesce(
    nullif(cultivar.care_override ->> 'toxicity', ''),
    species.toxicity
  ) as effective_toxicity,
  coalesce(
    (cultivar.care_override ->> 'pet_toxic')::boolean,
    species.pet_toxic
  ) as effective_pet_toxic,
  coalesce(
    (cultivar.care_override ->> 'human_toxic')::boolean,
    species.human_toxic
  ) as effective_human_toxic,
  coalesce(cultivar.image_key, species.image_key) as image_key,
  coalesce(cultivar.popularity_rank, species.popularity_rank)
    as popularity_rank,
  cultivar.review_status,
  cultivar.is_active
from public.plant_cultivars cultivar
join public.plant_species species
  on species.id = cultivar.species_id
join public.plant_genera genus
  on genus.id = species.genus_id
join public.plant_families family
  on family.id = genus.family_id
where cultivar.is_active
  and cultivar.review_status = 'published'
  and species.is_active
  and species.review_status = 'published'
  and genus.is_active
  and genus.review_status = 'published'
  and family.is_active
  and family.review_status = 'published';

create or replace view public.plant_type_catalog_compatibility
with (security_invoker = true)
as
select
  legacy.id as plant_type_id,
  legacy.scientific_name as legacy_scientific_name,
  legacy.default_interval_days,
  legacy.emoji,
  legacy.species_id,
  legacy.cultivar_id,
  catalog.catalog_id,
  catalog.entity_type,
  catalog.species_scientific_name,
  catalog.cultivar_name,
  catalog.display_name_ko,
  catalog.display_name_en,
  catalog.display_name_de
from public.plant_types legacy
left join public.plant_catalog catalog
  on (
    legacy.species_id is not null
    and catalog.entity_type = 'species'
    and catalog.species_id = legacy.species_id
  )
  or (
    legacy.cultivar_id is not null
    and catalog.entity_type = 'cultivar'
    and catalog.cultivar_id = legacy.cultivar_id
  );

create or replace function public.search_plant_catalog(
  search_query text,
  search_locale text default 'ko',
  result_limit integer default 30
)
returns setof public.plant_catalog
language sql
stable
security invoker
set search_path = ''
as $$
  with normalized_query as (
    select
      public.normalize_plant_search_term(search_query) as value,
      case
        when search_locale in ('ko', 'en', 'de', 'la')
          then search_locale
        else 'en'
      end as locale
  ),
  matches as (
    select
      case
        when terms.species_id is not null
          then 'species:' || terms.species_id::text
        else 'cultivar:' || terms.cultivar_id::text
      end as catalog_id,
      min(
        case
          when terms.normalized_term = query.value
               and terms.locale = query.locale
               and terms.term_type = 'primary'
            then 1
          when terms.normalized_term = query.value
               and terms.term_type in ('primary', 'common_name', 'cultivar_name')
            then 2
          when terms.normalized_term = query.value
               and terms.term_type = 'scientific_name'
            then 3
          when terms.locale = query.locale
               and left(terms.normalized_term, length(query.value)) = query.value
            then 4
          when terms.term_type in ('alias', 'synonym')
               and left(terms.normalized_term, length(query.value)) = query.value
            then 5
          when terms.term_type = 'cultivar_name'
               and left(terms.normalized_term, length(query.value)) = query.value
            then 6
          when position(query.value in terms.normalized_term) > 0
            then 7
          else 99
        end
      ) as match_rank,
      max(terms.priority) as term_priority
    from public.plant_search_terms terms
    cross join normalized_query query
    where query.value <> ''
      and position(query.value in terms.normalized_term) > 0
    group by
      case
        when terms.species_id is not null
          then 'species:' || terms.species_id::text
        else 'cultivar:' || terms.cultivar_id::text
      end
  )
  select catalog.*
  from public.plant_catalog catalog
  cross join normalized_query query
  left join matches
    on matches.catalog_id = catalog.catalog_id
  where query.value = ''
     or matches.catalog_id is not null
  order by
    case when query.value = '' then 0 else matches.match_rank end,
    matches.term_priority desc nulls last,
    catalog.popularity_rank desc nulls last,
    case query.locale
      when 'ko' then catalog.display_name_ko
      when 'de' then catalog.display_name_de
      else catalog.display_name_en
    end,
    catalog.species_scientific_name,
    catalog.cultivar_name
  limit least(greatest(coalesce(result_limit, 30), 1), 100);
$$;

revoke all on function public.search_plant_catalog(text, text, integer)
  from public;
grant execute on function public.search_plant_catalog(text, text, integer)
  to anon, authenticated, service_role;

create or replace function private.create_plant_cultivar(
  target_species_id uuid,
  new_cultivar_name text,
  new_display_name_ko text default null,
  new_display_name_en text default null,
  new_display_name_de text default null,
  new_image_key text default null,
  new_care_override jsonb default null,
  new_search_terms jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_cultivar_id uuid;
begin
  if not exists (
    select 1
    from public.plant_species
    where id = target_species_id
  ) then
    raise exception 'Unknown species_id: %', target_species_id;
  end if;

  if btrim(coalesce(new_cultivar_name, '')) = '' then
    raise exception 'cultivar_name is required';
  end if;

  if jsonb_typeof(coalesce(new_search_terms, '[]'::jsonb)) <> 'array' then
    raise exception 'search_terms must be a JSON array';
  end if;

  insert into public.plant_cultivars (
    species_id,
    cultivar_name,
    display_name_ko,
    display_name_en,
    display_name_de,
    image_key,
    care_override,
    review_status
  )
  values (
    target_species_id,
    btrim(new_cultivar_name),
    nullif(btrim(new_display_name_ko), ''),
    nullif(btrim(new_display_name_en), ''),
    nullif(btrim(new_display_name_de), ''),
    nullif(btrim(new_image_key), ''),
    new_care_override,
    'published'
  )
  returning id into new_cultivar_id;

  insert into public.plant_search_terms (
    cultivar_id,
    locale,
    term,
    normalized_term,
    term_type,
    priority
  )
  select
    new_cultivar_id,
    default_term.locale,
    default_term.term,
    default_term.term,
    'cultivar_name',
    default_term.priority
  from (
    values
      ('en'::text, new_cultivar_name, 100),
      ('ko'::text, new_display_name_ko, 100),
      ('en'::text, new_display_name_en, 110),
      ('de'::text, new_display_name_de, 100)
  ) as default_term(locale, term, priority)
  where btrim(coalesce(default_term.term, '')) <> ''
  on conflict do nothing;

  insert into public.plant_search_terms (
    cultivar_id,
    locale,
    term,
    normalized_term,
    term_type,
    priority
  )
  select
    new_cultivar_id,
    item.locale,
    item.term,
    item.term,
    coalesce(item.term_type, 'alias'),
    coalesce(item.priority, 0)
  from jsonb_to_recordset(
    coalesce(new_search_terms, '[]'::jsonb)
  ) as item(
    locale text,
    term text,
    term_type text,
    priority integer
  )
  on conflict do nothing;

  return new_cultivar_id;
end;
$$;

revoke all on function private.create_plant_cultivar(
  uuid,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  jsonb
) from public, anon, authenticated;
grant execute on function private.create_plant_cultivar(
  uuid,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  jsonb
) to service_role;

alter table public.plant_families enable row level security;
alter table public.plant_genera enable row level security;
alter table public.plant_species enable row level security;
alter table public.plant_cultivars enable row level security;
alter table public.plant_search_terms enable row level security;

create policy "Published families are readable"
on public.plant_families
for select
to anon, authenticated
using (is_active and review_status = 'published');

create policy "Published genera are readable"
on public.plant_genera
for select
to anon, authenticated
using (
  is_active
  and review_status = 'published'
  and exists (
    select 1
    from public.plant_families family
    where family.id = plant_genera.family_id
      and family.is_active
      and family.review_status = 'published'
  )
);

create policy "Published species are readable"
on public.plant_species
for select
to anon, authenticated
using (
  is_active
  and review_status = 'published'
  and exists (
    select 1
    from public.plant_genera genus
    join public.plant_families family
      on family.id = genus.family_id
    where genus.id = plant_species.genus_id
      and genus.is_active
      and genus.review_status = 'published'
      and family.is_active
      and family.review_status = 'published'
  )
);

create policy "Published cultivars are readable"
on public.plant_cultivars
for select
to anon, authenticated
using (
  is_active
  and review_status = 'published'
  and exists (
    select 1
    from public.plant_species species
    where species.id = plant_cultivars.species_id
      and species.is_active
      and species.review_status = 'published'
  )
);

create policy "Published search terms are readable"
on public.plant_search_terms
for select
to anon, authenticated
using (
  (
    species_id is not null
    and exists (
      select 1
      from public.plant_species species
      where species.id = plant_search_terms.species_id
        and species.is_active
        and species.review_status = 'published'
    )
  )
  or
  (
    cultivar_id is not null
    and exists (
      select 1
      from public.plant_cultivars cultivar
      join public.plant_species species
        on species.id = cultivar.species_id
      where cultivar.id = plant_search_terms.cultivar_id
        and cultivar.is_active
        and cultivar.review_status = 'published'
        and species.is_active
        and species.review_status = 'published'
    )
  )
);

revoke all on table
  public.plant_families,
  public.plant_genera,
  public.plant_species,
  public.plant_cultivars,
  public.plant_search_terms
from anon, authenticated;

grant select on table
  public.plant_families,
  public.plant_genera,
  public.plant_species,
  public.plant_cultivars,
  public.plant_search_terms
to anon, authenticated;

grant select on table
  public.plant_catalog,
  public.plant_type_catalog_compatibility
to anon, authenticated;

grant all on table
  public.plant_families,
  public.plant_genera,
  public.plant_species,
  public.plant_cultivars,
  public.plant_search_terms
to service_role;

grant execute on function private.set_updated_at()
  to service_role;

commit;
