export function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + Number(days));
  return toISODate(date);
}

export function getTodayISO() {
  return toISODate(new Date());
}

export function isValidRentalPeriod(days) {
  return [7, 15, 30].includes(Number(days));
}
