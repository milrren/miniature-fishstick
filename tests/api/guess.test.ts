import { vi, expect, test } from 'vitest';

vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => ({ body, init })
    }
  };
});

import { POST } from '../../app/api/guess/route';

test('POST returns 400 when guess is missing or invalid', async () => {
  const req = { json: async () => ({}) } as unknown as Request;
  const res = await POST(req);
  expect(res.init).toBeDefined();
  expect(res.init.status).toBe(400);
  expect(res.body).toMatchObject({ error: 'Guess is required' });
});
