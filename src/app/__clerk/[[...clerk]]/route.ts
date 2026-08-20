import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(req: NextRequest) {
  const url = new URL(req.url);
  const targetPath = url.pathname.replace(/^\/__clerk/, '');
  const targetUrl = `https://frontend-api.clerk.services${targetPath}${url.search}`;

  const reqHeaders = new Headers(req.headers);

  // Set x-forwarded-host to clerk.event-calendar-app-ecru.vercel.app or url.host to match Clerk Frontend API host
  const forwardedHost =
    process.env.CLERK_FRONTEND_API ||
    `clerk.${url.host.replace(/^clerk\./, '')}`;

  reqHeaders.set('x-forwarded-host', forwardedHost);
  reqHeaders.set('x-forwarded-proto', url.protocol.replace(':', ''));
  reqHeaders.set('host', 'frontend-api.clerk.services');

  try {
    const body =
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.arrayBuffer()
        : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: reqHeaders,
      body,
      redirect: 'manual',
    });

    const resHeaders = new Headers(response.headers);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error('Clerk proxy error:', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
