export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0',
  );
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseCalendarDate(value: string) {
  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnlyMatch) {
    return new Date(
      Number(dateOnlyMatch[1]),
      Number(dateOnlyMatch[2]) - 1,
      Number(dateOnlyMatch[3]),
    );
  }

  return new Date(value);
}

export function isSameLocalMonth(
  date: Date,
  year: number,
  month: number,
) {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month
  );
}

export function buildMonthCells(
  year: number,
  month: number,
) {
  const firstDay = new Date(year, month, 1);
  const leadingEmptyCount =
    (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();
  const cells: Array<Date | null> = Array.from(
    { length: leadingEmptyCount },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function getMonthBounds(
  year: number,
  month: number,
) {
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  };
}
