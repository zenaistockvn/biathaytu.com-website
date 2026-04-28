import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { verifyCronAuth, generateOAuthState, parseOAuthState } from '@/lib/auth';

/**
 * Note: getAuthContext() now requires real Supabase Auth session (async).
 * Testing it properly requires mocking createServerClient + auth.getUser().
 * Those tests belong in integration tests. Here we focus on sync helpers.
 */

describe('verifyCronAuth', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'test-secret-123' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns null when authorization header matches CRON_SECRET', () => {
    const request = new Request('http://localhost/api/cron/test', {
      headers: { authorization: 'Bearer test-secret-123' },
    });
    const result = verifyCronAuth(request);
    expect(result).toBeNull();
  });

  it('returns 401 response when authorization header is missing', () => {
    const request = new Request('http://localhost/api/cron/test');
    const result = verifyCronAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it('returns 401 response when authorization header is wrong', () => {
    const request = new Request('http://localhost/api/cron/test', {
      headers: { authorization: 'Bearer wrong-secret' },
    });
    const result = verifyCronAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it('returns 401 when Bearer prefix is missing', () => {
    const request = new Request('http://localhost/api/cron/test', {
      headers: { authorization: 'test-secret-123' },
    });
    const result = verifyCronAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it('401 response body contains error message', async () => {
    const request = new Request('http://localhost/api/cron/test');
    const result = verifyCronAuth(request);
    const body = await result!.json();
    expect(body).toEqual({ error: 'Unauthorized' });
  });
});

describe('generateOAuthState / parseOAuthState', () => {
  it('generates a base64url-encoded state string', () => {
    const state = generateOAuthState('tenant-abc');
    expect(typeof state).toBe('string');
    expect(state.length).toBeGreaterThan(0);
    expect(state).not.toMatch(/[+/=]/);
  });

  it('parseOAuthState returns the original tenantId', () => {
    const state = generateOAuthState('tenant-abc');
    const tenantId = parseOAuthState(state);
    expect(tenantId).toBe('tenant-abc');
  });

  it('parseOAuthState returns null for invalid state', () => {
    expect(parseOAuthState('totally-invalid')).toBeNull();
  });

  it('parseOAuthState returns null for empty string', () => {
    expect(parseOAuthState('')).toBeNull();
  });

  it('parseOAuthState returns null for expired state (>10 min)', () => {
    const oldTimestamp = Date.now() - 11 * 60 * 1000;
    const payload = `tenant-abc:${oldTimestamp}`;
    const expiredState = Buffer.from(payload).toString('base64url');
    expect(parseOAuthState(expiredState)).toBeNull();
  });

  it('parseOAuthState returns tenantId for recent state (<10 min)', () => {
    const recentTimestamp = Date.now() - 5 * 60 * 1000;
    const payload = `tenant-abc:${recentTimestamp}`;
    const state = Buffer.from(payload).toString('base64url');
    expect(parseOAuthState(state)).toBe('tenant-abc');
  });

  it('roundtrip works with different tenant IDs', () => {
    const ids = ['id-1', 'uuid-abc-def', 'long-tenant-identifier-12345'];
    for (const id of ids) {
      const state = generateOAuthState(id);
      expect(parseOAuthState(state)).toBe(id);
    }
  });
});
