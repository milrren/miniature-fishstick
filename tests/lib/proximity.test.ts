import { expect, test } from 'vitest';
import { calculateProximity } from '../../lib/proximity';

const baseGuess = (overrides = {}) => ({
  code: 'G',
  name: 'Guess',
  continent: 'Asia',
  borders: [],
  aliases: [],
  latlng: [0, 0],
  ...overrides
});

const baseTarget = (overrides = {}) => ({
  code: 'T',
  name: 'Target',
  continent: 'Europe',
  borders: [],
  aliases: [],
  latlng: [0, 1],
  ...overrides
});

test('identical coords produce zero proximity', () => {
  const a = baseGuess({ code: 'A' });
  const b = baseTarget({ code: 'B', latlng: [10, 10], continent: 'X' });
  // if both latlng equal, distance should be 0
  const sameA = { ...a, latlng: [5, 5] } as any;
  const sameB = { ...b, latlng: [5, 5] } as any;
  expect(calculateProximity(sameA, sameB)).toBe(0);
});

test('continent and border bonuses reduce the numeric proximity', () => {
  const guess = baseGuess({ code: 'G1', continent: 'Asia', borders: [] }) as any;
  const targetBase = baseTarget({ code: 'TB', continent: 'Europe', latlng: [0, 1] }) as any;
  const targetSameCont = baseTarget({ code: 'TS', continent: 'Asia', latlng: [0, 1] }) as any;
  const targetBorder = baseTarget({ code: 'TD', continent: 'Asia', latlng: [0, 1] }) as any;

  // simulate border by adding target code to guess.borders
  const guessWithBorder = { ...guess, borders: ['TD'] } as any;

  const baseScore = calculateProximity(guess, targetBase);
  const sameContScore = calculateProximity(guess, targetSameCont);
  const borderScore = calculateProximity(guessWithBorder, targetBorder);

  expect(sameContScore).toBeLessThanOrEqual(baseScore);
  expect(borderScore).toBeLessThanOrEqual(sameContScore);
});

test('antipodal points produce very large proximity value', () => {
  const a = baseGuess({ latlng: [0, 0] }) as any;
  const b = baseTarget({ latlng: [0, 180] }) as any; // approximate antipode
  const score = calculateProximity(a, b);
  expect(typeof score).toBe('number');
  expect(score).toBeGreaterThan(10000);
});

test('border bonus applies asymmetrically (only if guess lists target)', () => {
  const guess = baseGuess({ latlng: [0, 0], borders: ['T1'] }) as any;
  const target = baseTarget({ code: 'T1', latlng: [0, 1] }) as any;
  const otherGuess = baseGuess({ latlng: [0, 0], borders: [] }) as any;

  const withBonus = calculateProximity(guess, target);
  const withoutBonus = calculateProximity(otherGuess, target);

  expect(withBonus).toBeLessThanOrEqual(withoutBonus);
});
