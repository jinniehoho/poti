import { supabase } from '../lib/supabase';
import type { AppLanguage } from '../preferences/LanguageContext';
import type { Plant } from '../types/plant';
import { getPlantEmoji } from '../constants/plantEmojiMap';
import { translate } from '../i18n/translations';
import { getLocalizedPlantLocationName } from './plantLocationService';

export type CreatePlantInput = {
  plantTypeId: number | null;
  plantSpeciesId: string | null;
  plantCultivarId: string | null;
  locationId: string | null;
  displayName: string;
  wateringMode: 'automatic' | 'custom';
  customIntervalDays: number | null;
};

type CreatedPlantRow = {
  id: number;
  plant_type_id: number | null;
  plant_species_id: string | null;
  plant_cultivar_id: string | null;
  location_id: string | null;
  display_name: string;
  watering_mode: 'automatic' | 'custom';
  custom_interval_days: number | null;
  created_at: string;
  is_active: boolean;
};

type PlantWateringStatusRow = {
  plant_id: number;
  plant_type_id: number | null;
  plant_species_id: string | null;
  plant_cultivar_id: string | null;
  display_name: string;
  plant_type_name: string;
  species_scientific_name: string | null;
  cultivar_name: string | null;
  catalog_name_ko: string | null;
  catalog_name_en: string | null;
  catalog_name_de: string | null;
  emoji: string;
  days_until_watering: number;
  watering_status:
    | 'overdue'
    | 'due_today'
    | 'not_due';
};

type PlantTranslationRow = {
  plant_type_id: number;
  language_code: AppLanguage;
  name: string;
};

type PlantCatalogImageRow = {
  species_id: string;
  cultivar_id: string | null;
  image_key: string | null;
};

type PlantCatalogCareRow = {
  species_id: string;
  cultivar_id: string | null;
  effective_humidity_min: number | null;
  effective_humidity_max: number | null;
  effective_temperature_min_c: number | null;
  effective_temperature_max_c: number | null;
  effective_pet_toxic: boolean | null;
};

type PlantLocationLinkRow = {
  id: number;
  location_id: string | null;
};

type PlantLocationNameRow = {
  id: string;
  name: string;
};

let starterPlantPromise:
  | Promise<void>
  | null = null;

function getCatalogEntityKey(
  speciesId: string,
  cultivarId: string | null,
) {
  return `${speciesId}:${cultivarId ?? 'species'}`;
}

async function getCatalogImageKeyMap(
  plants: Array<{
    plant_species_id: string | null;
    plant_cultivar_id: string | null;
  }>,
) {
  const speciesIds = [
    ...new Set(
      plants
        .map((plant) => plant.plant_species_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  if (speciesIds.length === 0) {
    return new Map<string, string>();
  }

  const { data, error } = await supabase
    .from('plant_catalog')
    .select('species_id, cultivar_id, image_key')
    .in('species_id', speciesIds);

  if (error) {
    throw error;
  }

  return new Map(
    ((data ?? []) as PlantCatalogImageRow[])
      .filter(
        (row): row is PlantCatalogImageRow & {
          image_key: string;
        } => Boolean(row.image_key),
      )
      .map((row) => [
        getCatalogEntityKey(
          row.species_id,
          row.cultivar_id,
        ),
        row.image_key,
      ]),
  );
}

function getPlantImageKey(
  imageKeys: Map<string, string>,
  speciesId: string | null,
  cultivarId: string | null,
) {
  if (!speciesId) {
    return null;
  }

  return (
    imageKeys.get(
      getCatalogEntityKey(speciesId, cultivarId),
    ) ??
    imageKeys.get(
      getCatalogEntityKey(speciesId, null),
    ) ??
    null
  );
}

async function getCatalogCare(
  speciesId: string | null,
  cultivarId: string | null,
) {
  if (!speciesId) {
    return null;
  }

  const { data, error } = await supabase
    .from('plant_catalog')
    .select(`
      species_id,
      cultivar_id,
      effective_humidity_min,
      effective_humidity_max,
      effective_temperature_min_c,
      effective_temperature_max_c,
      effective_pet_toxic
    `)
    .eq('species_id', speciesId);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as PlantCatalogCareRow[];

  return (
    rows.find(
      (row) =>
        cultivarId !== null &&
        row.cultivar_id === cultivarId,
    ) ??
    rows.find((row) => row.cultivar_id === null) ??
    null
  );
}

async function getCatalogCareMap(
  plants: Array<{
    plant_species_id: string | null;
    plant_cultivar_id: string | null;
  }>,
) {
  const speciesIds = [
    ...new Set(
      plants
        .map((plant) => plant.plant_species_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  if (speciesIds.length === 0) {
    return new Map<string, PlantCatalogCareRow>();
  }

  const { data, error } = await supabase
    .from('plant_catalog')
    .select(`
      species_id,
      cultivar_id,
      effective_humidity_min,
      effective_humidity_max,
      effective_temperature_min_c,
      effective_temperature_max_c,
      effective_pet_toxic
    `)
    .in('species_id', speciesIds);

  if (error) {
    throw error;
  }

  return new Map(
    ((data ?? []) as PlantCatalogCareRow[]).map((row) => [
      getCatalogEntityKey(row.species_id, row.cultivar_id),
      row,
    ]),
  );
}

function getPlantCatalogCare(
  careMap: Map<string, PlantCatalogCareRow>,
  speciesId: string | null,
  cultivarId: string | null,
) {
  if (!speciesId) {
    return null;
  }

  return (
    careMap.get(getCatalogEntityKey(speciesId, cultivarId)) ??
    careMap.get(getCatalogEntityKey(speciesId, null)) ??
    null
  );
}

async function getPlantLocationNameMap(
  plantIds: number[],
  language: AppLanguage,
) {
  if (plantIds.length === 0) {
    return new Map<number, string>();
  }

  const { data: plantLinks, error: plantError } =
    await supabase
      .from('plants')
      .select('id, location_id')
      .in('id', plantIds);

  if (plantError) {
    throw plantError;
  }

  const links = (plantLinks ?? []) as PlantLocationLinkRow[];
  const locationIds = [
    ...new Set(
      links
        .map((plant) => plant.location_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  if (locationIds.length === 0) {
    return new Map<number, string>();
  }

  const { data: locations, error: locationError } =
    await supabase
      .from('plant_locations')
      .select('id, name')
      .in('id', locationIds);

  if (locationError) {
    throw locationError;
  }

  const namesById = new Map(
    ((locations ?? []) as PlantLocationNameRow[]).map(
      (location) => [
        location.id,
        getLocalizedPlantLocationName(
          location.name,
          language,
        ),
      ],
    ),
  );

  return new Map(
    links.flatMap((plant) => {
      const name = plant.location_id
        ? namesById.get(plant.location_id)
        : null;

      return name ? [[plant.id, name] as const] : [];
    }),
  );
}

function getCatalogName(
  row: PlantWateringStatusRow,
  language: AppLanguage,
) {
  if (language === 'ko') {
    return (
      row.catalog_name_ko ||
      row.catalog_name_en ||
      row.plant_type_name
    );
  }

  if (language === 'de') {
    return (
      row.catalog_name_de ||
      row.catalog_name_en ||
      row.plant_type_name
    );
  }

  return (
    row.catalog_name_en ||
    row.plant_type_name
  );
}

async function resolveLegacyPlantTypeId(
  input: CreatePlantInput,
) {
  if (input.plantTypeId !== null) {
    return input.plantTypeId;
  }

  if (!input.plantSpeciesId) {
    return null;
  }

  let query = supabase
    .from('plant_types')
    .select('id')
    .eq('species_id', input.plantSpeciesId);

  query = input.plantCultivarId
    ? query.eq('cultivar_id', input.plantCultivarId)
    : query.is('cultivar_id', null);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '식물 데이터를 사용하려면 사용자 인증이 필요합니다.',
    );
  }

  return session.user.id;
}

async function getOwnedActivePlantIds(
  userId: string,
) {
  const { data, error } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => row.id);
}

async function getTranslationMap(
  plantTypeIds: number[],
  language: AppLanguage,
) {
  if (plantTypeIds.length === 0) {
    return new Map<number, string>();
  }

  const languages =
    language === 'en'
      ? ['en']
      : [language, 'en'];

  const { data, error } = await supabase
    .from('plant_type_translations')
    .select(
      'plant_type_id, language_code, name',
    )
    .in('plant_type_id', plantTypeIds)
    .in('language_code', languages);

  if (error) {
    throw error;
  }

  const rows =
    (data ?? []) as PlantTranslationRow[];
  const translations =
    new Map<number, string>();

  rows
    .filter(
      (row) => row.language_code === 'en',
    )
    .forEach((row) => {
      translations.set(
        row.plant_type_id,
        row.name,
      );
    });

  rows
    .filter(
      (row) =>
        row.language_code === language,
    )
    .forEach((row) => {
      translations.set(
        row.plant_type_id,
        row.name,
      );
    });

  return translations;
}

function getStatusText(
  daysUntilWatering: number,
  language: AppLanguage,
) {
  if (daysUntilWatering < 0) {
    const days = Math.abs(daysUntilWatering);

    return days === 1
      ? translate(language, 'plantDetail.overdueOneDay')
      : translate(language, 'plantDetail.overdueDays', {
          days,
        });
  }

  if (daysUntilWatering === 0) {
    return translate(language, 'plantDetail.today');
  }

  return daysUntilWatering === 1
    ? translate(language, 'plantDetail.dueInOneDay')
    : translate(language, 'plantDetail.dueInDays', {
        days: daysUntilWatering,
      });
}

export async function createPlant(
  input: CreatePlantInput,
): Promise<CreatedPlantRow> {
  const userId = await getCurrentUserId();
  const legacyPlantTypeId =
    await resolveLegacyPlantTypeId(input);
  const { data, error } = await supabase
    .from('plants')
    .insert({
      user_id: userId,
      plant_type_id: legacyPlantTypeId,
      plant_species_id: input.plantSpeciesId,
      plant_cultivar_id: input.plantCultivarId,
      location_id: input.locationId,
      display_name: input.displayName,
      watering_mode: input.wateringMode,
      custom_interval_days:
        input.customIntervalDays,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function ensureStarterPlant(
  language: AppLanguage,
): Promise<void> {
  if (starterPlantPromise) {
    return starterPlantPromise;
  }

  starterPlantPromise = (async () => {
    const userId = await getCurrentUserId();
    const ownedPlantIds =
      await getOwnedActivePlantIds(userId);

    if (ownedPlantIds.length > 0) {
      return;
    }

    const starterNames: Record<
      AppLanguage,
      string
    > = {
      ko: '새싹이',
      en: 'Sprout',
      de: 'Keimling',
    };

    const { error } = await supabase
      .from('plants')
      .insert({
        user_id: userId,
        plant_type_id: 1,
        display_name:
          starterNames[language],
        watering_mode: 'automatic',
        custom_interval_days: null,
      });

    if (error) {
      throw error;
    }
  })();

  try {
    await starterPlantPromise;
  } finally {
    starterPlantPromise = null;
  }
}

export async function getPlants(
  language: AppLanguage,
): Promise<Plant[]> {
  const userId = await getCurrentUserId();
  const ownedPlantIds =
    await getOwnedActivePlantIds(userId);

  if (ownedPlantIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('v_plant_watering_status')
    .select(`
      plant_id,
      plant_type_id,
      plant_species_id,
      plant_cultivar_id,
      display_name,
      plant_type_name,
      emoji,
      species_scientific_name,
      cultivar_name,
      catalog_name_ko,
      catalog_name_en,
      catalog_name_de,
      days_until_watering,
      watering_status
    `)
    .in('plant_id', ownedPlantIds)
    .order('next_watering_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const rows =
    (data ?? []) as PlantWateringStatusRow[];
  const [
    translationMap,
    imageKeyMap,
    catalogCareMap,
    locationNameMap,
  ] =
    await Promise.all([
      getTranslationMap(
      rows
        .map((row) => row.plant_type_id)
        .filter((id): id is number => id !== null),
      language,
      ),
      getCatalogImageKeyMap(rows),
      getCatalogCareMap(rows),
      getPlantLocationNameMap(
        rows.map((row) => row.plant_id),
        language,
      ),
    ]);

  return rows.map((row) => {
    const care = getPlantCatalogCare(
      catalogCareMap,
      row.plant_species_id,
      row.plant_cultivar_id,
    );

    return {
      id: row.plant_id,
      name: row.display_name,
      typeName:
        row.plant_species_id
          ? getCatalogName(row, language)
          : (
            row.plant_type_id !== null
              ? translationMap.get(row.plant_type_id)
              : null
          ) ?? row.plant_type_name,
      scientificName:
        row.species_scientific_name,
      imageKey: getPlantImageKey(
        imageKeyMap,
        row.plant_species_id,
        row.plant_cultivar_id,
      ),
      locationName:
        locationNameMap.get(row.plant_id) ?? null,
      temperatureMinC:
        care?.effective_temperature_min_c ?? null,
      temperatureMaxC:
        care?.effective_temperature_max_c ?? null,
      humidityMin:
        care?.effective_humidity_min ?? null,
      humidityMax:
        care?.effective_humidity_max ?? null,
      petToxic:
        care?.effective_pet_toxic ?? null,
      emoji:
        row.plant_species_id
          ? getPlantEmoji(row.species_scientific_name)
          : row.emoji,
      status: row.watering_status,
      statusText: getStatusText(
        row.days_until_watering,
        language,
      ),
    };
  });
}

export async function getPlantById(
  id: number,
  language: AppLanguage,
) {
  const userId = await getCurrentUserId();
  const {
    data: ownedPlant,
    error: ownershipError,
  } = await supabase
    .from('plants')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (ownershipError || !ownedPlant) {
    throw (
      ownershipError ??
      new Error('식물을 찾을 수 없습니다.')
    );
  }

  const { data, error } = await supabase
    .from('v_plant_watering_status')
    .select(`
      plant_id,
      plant_type_id,
      plant_species_id,
      plant_cultivar_id,
      display_name,
      plant_type_name,
      emoji,
      species_scientific_name,
      cultivar_name,
      catalog_name_ko,
      catalog_name_en,
      catalog_name_de,
      interval_days,
      last_watered_at,
      next_watering_at,
      watering_status,
      days_until_watering
    `)
    .eq('plant_id', id)
    .single();

  if (error) {
    throw error;
  }

  const [
    translationMap,
    imageKeyMap,
    catalogCare,
  ] = await Promise.all([
    getTranslationMap(
      data.plant_type_id !== null
        ? [data.plant_type_id]
        : [],
      language,
    ),
    getCatalogImageKeyMap([data]),
    getCatalogCare(
      data.plant_species_id,
      data.plant_cultivar_id,
    ),
  ]);

  const row = data as PlantWateringStatusRow & {
    interval_days: number;
    last_watered_at: string | null;
    next_watering_at: string;
    watering_status:
      | 'overdue'
      | 'due_today'
      | 'not_due';
    days_until_watering: number;
  };

  return {
    ...row,
    plant_type_name:
      row.plant_species_id
        ? getCatalogName(row, language)
        : (
          row.plant_type_id !== null
            ? translationMap.get(row.plant_type_id)
            : null
        ) ?? row.plant_type_name,
    emoji:
      row.plant_species_id
        ? getPlantEmoji(row.species_scientific_name)
        : row.emoji,
    image_key: getPlantImageKey(
      imageKeyMap,
      row.plant_species_id,
      row.plant_cultivar_id,
    ),
    temperature_min_c:
      catalogCare?.effective_temperature_min_c ??
      null,
    temperature_max_c:
      catalogCare?.effective_temperature_max_c ??
      null,
    humidity_min:
      catalogCare?.effective_humidity_min ?? null,
    humidity_max:
      catalogCare?.effective_humidity_max ?? null,
    pet_toxic:
      catalogCare?.effective_pet_toxic ?? null,
  };
}

export type EditablePlant = {
  id: number;
  plantTypeId: number | null;
  plantSpeciesId: string | null;
  plantCultivarId: string | null;
  locationId: string | null;
  catalogName: string;
  scientificName: string | null;
  imageKey: string | null;
  emoji: string;
  recommendedIntervalDays: number;
  displayName: string;
  wateringMode: 'automatic' | 'custom';
  customIntervalDays: number | null;
  lastWateredAt: string | null;
};

type EditablePlantRow = {
  id: number;
  plant_type_id: number | null;
  plant_species_id: string | null;
  plant_cultivar_id: string | null;
  location_id: string | null;
  display_name: string;
  watering_mode: 'automatic' | 'custom';
  custom_interval_days: number | null;
};

export async function getEditablePlantById(
  id: number,
): Promise<EditablePlant> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('plants')
    .select(`
      id,
      plant_type_id,
      plant_species_id,
      plant_cultivar_id,
      location_id,
      display_name,
      watering_mode,
      custom_interval_days
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) {
    throw error;
  }

  const row = data as EditablePlantRow;
  const { data: statusData, error: statusError } =
    await supabase
      .from('v_plant_watering_status')
      .select(`
        plant_type_name,
        species_scientific_name,
        emoji,
        interval_days
      `)
      .eq('plant_id', id)
      .single();

  if (statusError) {
    throw statusError;
  }
  const {
    data: wateringHistory,
    error: wateringError,
  } = await supabase
    .from('watering_history')
    .select('watered_at')
    .eq('plant_id', id)
    .order('watered_at', {
      ascending: false,
    })
    .limit(1);

  if (wateringError) {
    throw wateringError;
  }

  const imageKeyMap = await getCatalogImageKeyMap([
    row,
  ]);

  return {
    id: row.id,
    plantTypeId: row.plant_type_id,
    plantSpeciesId: row.plant_species_id,
    plantCultivarId: row.plant_cultivar_id,
    locationId: row.location_id,
    catalogName: statusData.plant_type_name,
    scientificName:
      statusData.species_scientific_name,
    imageKey: getPlantImageKey(
      imageKeyMap,
      row.plant_species_id,
      row.plant_cultivar_id,
    ),
    emoji:
      row.plant_species_id
        ? getPlantEmoji(
            statusData.species_scientific_name,
          )
        : statusData.emoji,
    recommendedIntervalDays:
      statusData.interval_days,
    displayName: row.display_name,
    wateringMode: row.watering_mode,
    customIntervalDays:
      row.custom_interval_days,
    lastWateredAt:
      wateringHistory?.[0]?.watered_at ??
      null,
  };
}

export type UpdatePlantInput = {
  plantTypeId: number | null;
  plantSpeciesId: string | null;
  plantCultivarId: string | null;
  locationId: string | null;
  displayName: string;
  wateringMode: 'automatic' | 'custom';
  customIntervalDays: number | null;
};

export async function updatePlant(
  id: number,
  input: UpdatePlantInput,
): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('plants')
    .update({
      plant_type_id: input.plantTypeId,
      plant_species_id: input.plantSpeciesId,
      plant_cultivar_id: input.plantCultivarId,
      location_id: input.locationId,
      display_name: input.displayName,
      watering_mode: input.wateringMode,
      custom_interval_days:
        input.customIntervalDays,
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function deletePlant(
  id: number,
): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('plants')
    .update({
      is_active: false,
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
