export function dateWithoutTime(date: Date) {
  return date.toISOString().replace(/T.*$/, '');
}
