export function challengeDay(start: Date, now: Date) {
  const utc = (date: Date) =>
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utc(now) - utc(start)) / 86400000) + 1;
}
