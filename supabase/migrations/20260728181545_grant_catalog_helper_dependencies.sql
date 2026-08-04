-- Follow-up for the already-applied hierarchical catalog migration.
-- The helper remains service-role-only; these grants allow its constraints
-- and triggers to run under SECURITY INVOKER.

begin;

grant execute on function private.is_valid_plant_care_override(jsonb)
  to service_role;
grant execute on function private.normalize_plant_search_term_trigger()
  to service_role;
grant execute on function private.set_updated_at()
  to service_role;

commit;
