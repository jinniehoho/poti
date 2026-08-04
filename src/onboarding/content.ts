export const ONBOARDING_STORAGE_KEY =
  'onboardingCompleted';

export const ONBOARDING_COPY = {
  skip: 'onboarding.skip',
  next: 'onboarding.next',
  start: 'onboarding.start',
  settingsTitle: 'onboarding.settingsTitle',
  settingsDescription: 'onboarding.settingsDescription',
} as const;

export const ONBOARDING_STEPS = [
  {
    id: 'today',
    target: 'today',
    titleKey: 'onboarding.todayTitle',
    descriptionKey: 'onboarding.todayDescription',
  },
  {
    id: 'plants',
    target: 'plants',
    titleKey: 'onboarding.plantsTitle',
    descriptionKey: 'onboarding.plantsDescription',
  },
] as const;
