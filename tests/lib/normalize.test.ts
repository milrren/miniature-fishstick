import { expect, test } from 'vitest';
import { normalize } from '../../lib/normalize';

test('normalize removes accents, punctuation and trims', () => {
  expect(normalize('  São Tomé! ')).toBe('sao tome');
  // hyphen and apostrophe are removed but letters remain -> 'cotedazur'
  expect(normalize("Côte-d'Azur")).toBe('cotedazur');
  expect(normalize('ÁÉÍÓÚ àèìòù')).toBe('aeiou aeiou');
});

test('normalize handles empty and combining marks', () => {
  expect(normalize('')).toBe('');
  // 'e' + combining acute accent should normalize to 'e'
  expect(normalize('e\u0301')).toBe('e');
  // string of punctuation only becomes empty
  expect(normalize('  !!--__  ')).toBe('__');
});
