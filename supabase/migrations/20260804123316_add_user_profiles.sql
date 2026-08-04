create table public.profiles (
  user_id uuid primary key
    references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint profiles_nickname_check
    check (
      nickname is null
      or (
        nickname = btrim(nickname)
        and char_length(nickname) between 1 and 30
      )
    )
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.profiles
  from anon, authenticated;
grant select, insert, update
  on table public.profiles
  to authenticated;
grant select, insert, update
  on table public.profiles
  to service_role;

comment on table public.profiles is
  'Private user profile data for current and future shared plant care features.';
comment on column public.profiles.nickname is
  'Optional user-visible nickname. Unique names are not required.';
