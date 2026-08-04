export type WateringDaysValidationError =
  | 'required'
  | 'invalid';

export type WateringDaysValidationResult =
  | {
      value: number;
      error: null;
    }
  | {
      value: null;
      error: WateringDaysValidationError;
    };

export function validateWateringDays(
  input: string,
): WateringDaysValidationResult {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    return {
      value: null,
      error: 'required',
    };
  }

  if (!/^\d+$/.test(normalizedInput)) {
    return {
      value: null,
      error: 'invalid',
    };
  }

  const days = Number.parseInt(normalizedInput, 10);

  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 365
  ) {
    return {
      value: null,
      error: 'invalid',
    };
  }

  return {
    value: days,
    error: null,
  };
}
