# Hierarchical plant catalog

## Safety and compatibility decision

The production `plant_types` table and all existing numeric IDs remain in
place. Existing `plants.plant_type_id` rows and the `ON DELETE RESTRICT`
foreign key are unchanged.

The new taxonomy is added beside the legacy catalog:

```text
plant_families
└── plant_genera.family_id
    └── plant_species.genus_id
        ├── plant_cultivars.species_id
        └── plant_search_terms.species_id
            └── plant_search_terms.cultivar_id (alternative target)
```

`plant_types.species_id` and `plant_types.cultivar_id` are nullable
compatibility links. The three existing rows map to species records without
changing their IDs or scientific names. In particular, the legacy
`Sansevieria trifasciata` row maps to the accepted
`Dracaena trifasciata` species.

## App transition

- Existing add/edit screens continue to call `getPlantTypes()` and keep the
  current behavior.
- New catalog reads use `searchPlantCatalog()` or
  `getPopularPlantCatalog()` from `plantCatalogService.ts`.
- The registration screen should switch to the new picker only after catalog
  query, search, and persistence decisions are verified.
- No Build 8 or TestFlight submission is part of this migration.

## Care inheritance

`plant_catalog` exposes one row for every published species and cultivar.
Species care values are returned directly. Cultivar rows overlay only keys
present in `care_override`; every other care field falls back to the linked
species.

## Permissions

Anonymous and authenticated app clients can read only active, published
catalog rows. They receive no insert, update, or delete policy on master
catalog tables. The cultivar creation helper lives in the non-exposed
`private` schema and is executable only by `service_role`.

## Files

- `supabase/migrations/20260728180754_hierarchical_plant_catalog.sql`
- `supabase/migrations/20260728181545_grant_catalog_helper_dependencies.sql`
- `supabase/migrations/20260728181701_complete_catalog_cultivar_helper.sql`
- `supabase/verify_hierarchical_plant_catalog.sql`
- `src/types/plantCatalog.ts`
- `src/services/plantCatalogService.ts`

The validation migration seeds only 3 families, 4 genera, 4 species, and 13
cultivars. The planned larger catalog import is intentionally deferred.

## Verified production results

- Legacy plant types: 3 before and 3 after
- Existing user plants: 7 before and 7 after
- New catalog: 3 families, 4 genera, 4 species, 13 cultivars
- Public catalog rows: 17
- Legacy mappings: all three existing `plant_types` IDs mapped
- Marble Queen hierarchy and species care inheritance: passed
- Neon one-field care override with inherited watering values: passed
- Korean, English, German, accepted-name, and synonym searches: passed
- Spaces, hyphens, and apostrophe-insensitive `N'Joy` search: passed
- Anonymous and authenticated Data API reads: passed
- Authenticated master-data update denial: passed
- Service-role helper transaction, hierarchy, inheritance, automatic search
  term, and alias search: passed
- Verification-only cultivar persisted after rollback: 0 rows

## Deferred work

- The 80-species bulk catalog import
- A reviewed CSV import pipeline and translation review UI
- Persisting newly selected catalog species/cultivars on user plants
- Replacing the current three-item registration list with the searchable
  top-five picker
- Plant illustration production and image licensing metadata
- Build 8 and TestFlight submission
