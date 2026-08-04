-- Applied to the linked Supabase project on 2026-07-28.
-- Anonymous and permanent users both use the authenticated Postgres role;
-- auth.uid() ownership predicates keep each user's plant data isolated.

begin;

alter table public.plants
  alter column user_id set default auth.uid();

alter table public.plants
  add constraint plants_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade
  not valid;

create index if not exists idx_plants_user_active
  on public.plants (user_id, is_active);

drop policy if exists
  "Anyone can manage plants during development"
  on public.plants;

create policy "Users read own plants"
  on public.plants
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users create own plants"
  on public.plants
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update own plants"
  on public.plants
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete own plants"
  on public.plants
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.plants from anon;
grant select, insert, update, delete
  on public.plants to authenticated;

drop policy if exists
  "Development read watering history"
  on public.watering_history;
drop policy if exists
  "Development insert watering history"
  on public.watering_history;
drop policy if exists
  "Development delete watering history"
  on public.watering_history;

create policy "Users read own watering history"
  on public.watering_history
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.plants
      where plants.id = watering_history.plant_id
        and plants.user_id = (select auth.uid())
    )
  );

create policy "Users create own watering history"
  on public.watering_history
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.plants
      where plants.id = watering_history.plant_id
        and plants.user_id = (select auth.uid())
    )
  );

create policy "Users update own watering history"
  on public.watering_history
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.plants
      where plants.id = watering_history.plant_id
        and plants.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.plants
      where plants.id = watering_history.plant_id
        and plants.user_id = (select auth.uid())
    )
  );

create policy "Users delete own watering history"
  on public.watering_history
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.plants
      where plants.id = watering_history.plant_id
        and plants.user_id = (select auth.uid())
    )
  );

revoke all on public.watering_history from anon;
grant select, insert, update, delete
  on public.watering_history to authenticated;

revoke all on public.v_plant_watering_status from anon;
grant select
  on public.v_plant_watering_status to authenticated;

create table if not exists public.supported_languages (
  code varchar(5) primary key,
  english_name varchar(50) not null,
  native_name varchar(50) not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.supported_languages (
  code,
  english_name,
  native_name,
  is_active
)
values
  ('en', 'English', 'English', true),
  ('ko', 'Korean', '한국어', true),
  ('de', 'German', 'Deutsch', true),
  ('fr', 'French', 'Français', false)
on conflict (code) do update
set
  english_name = excluded.english_name,
  native_name = excluded.native_name,
  is_active = excluded.is_active;

alter table public.supported_languages
  enable row level security;

create policy "Anyone reads supported languages"
  on public.supported_languages
  for select
  to anon, authenticated
  using (true);

grant select
  on public.supported_languages to anon, authenticated;

alter table public.plant_type_translations
  drop constraint
  if exists plant_type_translations_language_code_check;

alter table public.plant_type_translations
  add constraint plant_type_translations_language_code_fkey
  foreign key (language_code)
  references public.supported_languages(code);

alter table public.plant_type_translations
  add column if not exists translation_status varchar(20)
    not null default 'reviewed'
    check (translation_status in ('draft', 'reviewed')),
  add column if not exists translation_source varchar(20)
    not null default 'manual'
    check (translation_source in ('manual', 'machine'));

commit;
