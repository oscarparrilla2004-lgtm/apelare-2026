import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function GET() {
  const env = process.env;

  // Check which Redis env vars are present (without exposing full secrets)
  const redisVars = {
    REDIS_URL: !!env.REDIS_URL,
    KV_URL: !!env.KV_URL,
    UPSTASH_REDIS_REST_URL: !!env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_URL: !!env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!env.KV_REST_API_TOKEN,
    VERCEL: env.VERCEL,
    NODE_ENV: env.NODE_ENV,
  };

  const redisUrl = env.REDIS_URL || env.KV_URL || env.STORAGE_URL;

  let ioredisTest: any = null;
  if (redisUrl) {
    try {
      const client = new Redis(redisUrl, { connectTimeout: 4000, maxRetriesPerRequest: 1 });
      const pingRes = await client.ping();
      const rawData = await client.get('akelarre_2026_teams');
      client.disconnect();
      ioredisTest = {
        ok: true,
        ping: pingRes,
        hasData: !!rawData,
        dataLength: rawData ? rawData.length : 0,
      };
    } catch (e) {
      ioredisTest = { error: String(e) };
    }
  }

  // Check REST credentials
  const restUrl = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || env.STORAGE_REST_API_URL;
  const restToken = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || env.STORAGE_REST_API_TOKEN;

  let restTest: any = null;
  if (restUrl && restToken) {
    try {
      const res = await fetch(`${restUrl}/ping`, {
        headers: { Authorization: `Bearer ${restToken}` },
        cache: 'no-store',
      });
      const data = await res.json();
      restTest = { ok: res.ok, status: res.status, result: data };
    } catch (e) {
      restTest = { error: String(e) };
    }
  }

  return NextResponse.json({
    envVars: redisVars,
    hasIORedis: !!redisUrl,
    hasRestRedis: !!(restUrl && restToken),
    ioredisTest,
    restTest,
  });
}

