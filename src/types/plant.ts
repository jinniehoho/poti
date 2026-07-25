export type WateringStatus = 'due_today' | 'overdue' | 'not_due';

export type Plant = {
  id: number;
  name: string;
  typeName: string;
  emoji: string;
  status: WateringStatus;
  statusText: string;
};