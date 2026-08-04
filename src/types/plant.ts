export type WateringStatus = 'due_today' | 'overdue' | 'not_due';

export type Plant = {
  id: number;
  name: string;
  typeName: string;
  scientificName: string | null;
  imageKey: string | null;
  locationName: string | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  humidityMin: number | null;
  humidityMax: number | null;
  petToxic: boolean | null;
  emoji: string;
  status: WateringStatus;
  statusText: string;
};
