import type { AppLanguage } from '../i18n/translations';

export const PLANT_NAME_CANDIDATES: Record<
  AppLanguage,
  readonly string[]
> = {
  ko: [
    '초록이',
    '새싹이',
    '푸릇이',
    '잎새',
    '초롱이',
    '보리',
    '몽글이',
    '쑥쑥이',
    '콩이',
    '나무',
    '솔이',
    '이파리',
    '그리니',
    '포리',
    '두리',
  ],
  en: [
    'Sprout',
    'Leafy',
    'Clover',
    'Moss',
    'Sunny',
    'Fern',
    'Olive',
    'Sage',
    'Bean',
    'Buddy',
    'Greenie',
    'Basil',
    'Flora',
    'Ivy',
    'Poppy',
  ],
  de: [
    'Spross',
    'Blättchen',
    'Klee',
    'Moos',
    'Sonne',
    'Farn',
    'Olive',
    'Salbei',
    'Böhnchen',
    'Grüni',
    'Flora',
    'Efeu',
    'Minze',
    'Lilli',
    'Pflänzchen',
  ],
};

export function generateRandomPlantName(
  locale: AppLanguage,
  random: () => number = Math.random,
) {
  const candidates = PLANT_NAME_CANDIDATES[locale];
  const index = Math.min(
    Math.floor(random() * candidates.length),
    candidates.length - 1,
  );

  return candidates[index];
}

export function createUniquePlantName(
  baseName: string,
  existingNames: readonly string[],
) {
  const normalizedBaseName = baseName.trim();
  const normalizedExistingNames = new Set(
    existingNames.map((name) => name.trim()),
  );

  if (!normalizedExistingNames.has(normalizedBaseName)) {
    return normalizedBaseName;
  }

  let suffix = 1;

  while (
    normalizedExistingNames.has(
      `${normalizedBaseName} (${suffix})`,
    )
  ) {
    suffix += 1;
  }

  return `${normalizedBaseName} (${suffix})`;
}
