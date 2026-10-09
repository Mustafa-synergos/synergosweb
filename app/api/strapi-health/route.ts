import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TIMEOUT_MS = 8000;

type CheckResult = {
  endpoint: string;
  ok: boolean;
  status?: number;
  count?: number;
  error?: string;
};

async function checkEndpoint(base: string, path: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${base}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { endpoint: path, ok: false, status: response.status };
    }

    const json = (await response.json()) as {
      data?: unknown[] | Record<string, unknown> | null;
    };
    const count = Array.isArray(json.data)
      ? json.data.length
      : json.data
        ? 1
        : 0;

    return { endpoint: path, ok: true, status: response.status, count };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { endpoint: path, ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * GET /api/strapi-health
 *
 * Verifies the frontend can reach the configured Strapi backend and read the
 * content types every page depends on. Reports status/counts only — never
 * echoes tokens, secrets, or response bodies.
 */
export async function GET() {
  const base =
    process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ||
    'http://localhost:1337';

  const checks = await Promise.all([
    checkEndpoint(base, '/api/services?pagination[pageSize]=1&fields[0]=slug'),
    checkEndpoint(base, '/api/pages?pagination[pageSize]=1&fields[0]=Slug'),
    checkEndpoint(base, '/api/blogs?pagination[pageSize]=1&fields[0]=Slug'),
    checkEndpoint(base, '/api/articles?pagination[pageSize]=1&fields[0]=Slug'),
    checkEndpoint(
      base,
      '/api/case-studies?pagination[pageSize]=1&fields[0]=Slug'
    ),
    checkEndpoint(base, '/api/careers?pagination[pageSize]=1&fields[0]=Slug'),
    checkEndpoint(base, '/api/footer?fields[0]=CopyrightText'),
  ]);

  const healthy = checks.every((check) => check.ok);

  return NextResponse.json(
    {
      healthy,
      strapiBase: base,
      serverTokenConfigured: Boolean(process.env.STRAPI_API_TOKEN),
      revalidateConfigured: Boolean(process.env.REVALIDATE_SECRET),
      now: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
