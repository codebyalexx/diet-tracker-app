export function normalizeDateToDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isTheSameDay(date1: Date, date2: Date) {
  return (
    normalizeDateToDay(date1).getTime() === normalizeDateToDay(date2).getTime()
  );
}
