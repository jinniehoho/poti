# Poti plant catalog and translation strategy

## Source of truth

- Use the scientific name as the stable, language-independent identity.
- Store user-given plant names only on `plants.display_name`. Never
  auto-translate these personal names.
- Store catalog names, descriptions, and care tips in
  `plant_type_translations`.
- Keep supported locales in `supported_languages` instead of a hard-coded
  database check. English, Korean, and German are active first; French is
  already reserved as the next locale.

## Translation workflow

Automatic translation should be an assisted publishing pipeline, not a
database trigger that directly calls an external AI service.

1. An admin imports or creates the canonical plant record.
2. A background job or Supabase Edge Function receives the plant ID.
3. The job generates missing locale rows through a translation provider.
4. Generated rows are stored with `translation_source = 'machine'` and
   `translation_status = 'draft'`.
5. A reviewer checks plant names and safety-sensitive care text.
6. Reviewed rows are published with `translation_status = 'reviewed'`.

Plant names often have multiple regional common names, so machine output
must not silently replace reviewed names. Pet-safety and toxicity text also
requires a traceable source and human review.

## Catalog growth

Grow the catalog in controlled releases:

- Phase 1: 50 common indoor plants
- Phase 2: 150 plants based on user search demand
- Phase 3: 500+ plants after search, alias, and image licensing systems are
  stable

Recommended import fields:

- scientific name
- family and genus
- localized common names
- search aliases
- default watering interval or range
- light requirement
- humidity preference
- difficulty
- pet safety and toxicity source
- image URL, license, and attribution

Use CSV for reviewed bulk imports. Upsert by scientific name so rerunning an
import updates existing records instead of creating duplicates.

## Selection UI for a large catalog

Replace the current full vertical list with a searchable picker:

- Search field at the top
- Recently used and popular plants before search
- Category chips such as Easy care, Low light, Pet safe, and Tropical
- Virtualized two-column results for performance
- Common name first, scientific name second
- Localized aliases included in search
- “I cannot find my plant” custom option at the end

The initial three-item card can remain while the catalog is small. Switch to
the picker before exceeding roughly 20–30 visible options.
