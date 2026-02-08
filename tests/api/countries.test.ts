import { vi, expect, test } from 'vitest';

vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => ({ body, init })
    }
  };
});

import { GET } from '../../app/api/countries/route';

test('GET returns list of country aliases', async () => {
  const res = await GET();
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(typeof res.body[0]).toBe('string');
});
