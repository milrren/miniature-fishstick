import { vi, expect, test } from 'vitest';
import { getCountryOfTheDay } from '../../lib/countryOfTheDay';

const makeCountries = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({ code: `C${i}` } as any));

test('getCountryOfTheDay is deterministic for a given date', () => {
  const countries = makeCountries(3);

  // 2024-01-01 is START_DATE. Use a date 9 days later -> index 9 % 3 = 0
  const fake = new Date('2024-01-10T00:00:00.000Z');
  vi.setSystemTime(fake);

  const selected = getCountryOfTheDay(countries as any);
  expect(selected.code).toBe('C0');

  // another date: 2024-01-12 -> diff 11 % 3 = 2
  vi.setSystemTime(new Date('2024-01-12T00:00:00.000Z'));
  const selected2 = getCountryOfTheDay(countries as any);
  expect(selected2.code).toBe('C2');

  vi.useRealTimers();
});

test('single country array always returns that country', () => {
  const countries = [{ code: 'ONLY' } as any];

  vi.setSystemTime(new Date('2024-02-05T00:00:00.000Z'));
  const selected = getCountryOfTheDay(countries as any);
  expect(selected.code).toBe('ONLY');

  vi.setSystemTime(new Date('2025-07-01T00:00:00.000Z'));
  const selected2 = getCountryOfTheDay(countries as any);
  expect(selected2.code).toBe('ONLY');

  vi.useRealTimers();
});

test('empty countries array returns undefined', () => {
  const res = getCountryOfTheDay([] as any);
  expect(res).toBeUndefined();
});
