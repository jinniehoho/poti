create table public.plant_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint plant_locations_name_check
    check (
      name = btrim(name)
      and char_length(name) between 1 and 50
    ),
  constraint plant_locations_user_name_key
    unique (user_id, name),
  constraint plant_locations_id_user_key
    unique (id, user_id)
);

create index plant_locations_user_sort_idx
  on public.plant_locations (user_id, sort_order, name);

alter table public.plants
  add column location_id uuid;

alter table public.plants
  add constraint plants_location_owner_fkey
  foreign key (location_id, user_id)
  references public.plant_locations (id, user_id)
  on delete set null (location_id);

create trigger plant_locations_set_updated_at
before update on public.plant_locations
for each row execute function private.set_updated_at();

alter table public.plant_locations enable row level security;

create policy "Users read own plant locations"
on public.plant_locations
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create own plant locations"
on public.plant_locations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update own plant locations"
on public.plant_locations
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users delete own plant locations"
on public.plant_locations
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.plant_locations from anon;
grant select, insert, update, delete
  on table public.plant_locations
  to authenticated;
grant select, insert, update, delete
  on table public.plant_locations
  to service_role;

create or replace function private.seed_default_plant_locations()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.plant_locations (
    user_id,
    name,
    sort_order
  )
  values
    (new.id, '거실', 10),
    (new.id, '침실', 20),
    (new.id, '주방', 30),
    (new.id, '욕실', 40),
    (new.id, '발코니', 50),
    (new.id, '서재', 60),
    (new.id, '현관', 70),
    (new.id, '야외', 80)
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

revoke all on function private.seed_default_plant_locations()
  from public, anon, authenticated;

create trigger seed_default_plant_locations_after_signup
after insert on auth.users
for each row execute function private.seed_default_plant_locations();

insert into public.plant_locations (
  user_id,
  name,
  sort_order
)
select
  users.id,
  defaults.name,
  defaults.sort_order
from auth.users as users
cross join (
  values
    ('거실', 10),
    ('침실', 20),
    ('주방', 30),
    ('욕실', 40),
    ('발코니', 50),
    ('서재', 60),
    ('현관', 70),
    ('야외', 80)
) as defaults(name, sort_order)
on conflict (user_id, name) do nothing;
