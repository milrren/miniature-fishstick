import { vi, expect, test } from 'vitest';

vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => ({ body, init })
    }
  };
});

import { GET } from '../../app/api/daily-country/route';

test('GET returns dayIndex, date and seed', async () => {
  const res = await GET();
  expect(res.body).toBeDefined();
  expect(typeof res.body.dayIndex).toBe('number');
  expect(typeof res.body.date).toBe('string');
  expect(typeof res.body.seed).toBe('string');
});
