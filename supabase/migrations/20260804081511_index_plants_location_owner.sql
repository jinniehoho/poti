create index if not exists idx_plants_location_owner
  on public.plants (location_id, user_id)
  where location_id is not null;
