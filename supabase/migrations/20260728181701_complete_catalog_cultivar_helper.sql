-- Make trusted service-role cultivar creation immediately visible and
-- searchable without requiring a schema or app change.

begin;

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

commit;
