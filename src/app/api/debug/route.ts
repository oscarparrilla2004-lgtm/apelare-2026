import { NextResponse } from 'next/server';

export async function GET() {
  const env = process.env;

  // Check which Redis env vars are present (without exposing values)
  const redisVars = {
    UPSTASH_REDIS_REST_URL: !!env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_URL: !!env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!env.KV_REST_API_TOKEN,
    STORAGE_REST_API_URL: !!env.STORAGE_REST_API_URL,
    STORAGE_REST_API_TOKEN: !!env.STORAGE_REST_API_TOKEN,
    VERCEL: env.VERCEL,
    NODE_ENV: env.NODE_ENV,
  };

  // Try to find any *_REST_API_URL env var
  const dynamicUrl = Object.keys(env).find((k) => k.endsWith('_REST_API_URL'));
  const dynamicToken = Object.keys(env).find((k) => k.endsWith('_REST_API_TOKEN'));

  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || env.STORAGE_REST_API_URL || (dynamicUrl ? env[dynamicUrl] : undefined);
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || env.STORAGE_REST_API_TOKEN || (dynamicToken ? env[dynamicToken] : undefined);

  let redisTest = null;
  if (url && token) {
    try {
      const res = await fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      redisTest = { ok: res.ok, status: res.status, result: data };
    } catch (e) {
      redisTest = { error: String(e) };
    }
  }

  // Try to read the key
  let keyTest = null;
  if (url && token) {
    try {
      const res = await fetch(`${url}/get/akelarre_2026_teams`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      keyTest = {
        ok: res.ok,
        status: res.status,
        hasResult: !!data.result,
        resultType: typeof data.result,
        resultPreview: data.result ? String(data.result).substring(0, 100) : null,
      };
    } catch (e) {
      keyTest = { error: String(e) };
    }
  }

  return NextResponse.json({
    envVars: redisVars,
    dynamicUrlKey: dynamicUrl || null,
    dynamicTokenKey: dynamicToken || null,
    hasRedisCredentials: !!(url && token),
    redisUrlPrefix: url ? url.substring(0, 30) + '...' : null,
    redisTest,
    keyTest,
  });
}
