import type { Config, Context } from '@netlify/edge-functions';
import { isAuthorizedRequest } from '../lib/session.ts';

export default async (request: Request, context: Context) => {
    const url = new URL(request.url);
    const publicPaths = new Set(['/login', '/login.html', '/auth/login.css', '/auth/login.js', '/api/auth']);

    if (publicPaths.has(url.pathname) || url.pathname === '/.netlify/identity' || url.pathname.startsWith('/.netlify/identity/')) {
        return;
    }

    if (!await isAuthorizedRequest(request)) {
        const headers = {
            'Cache-Control': 'private, no-store',
            'Netlify-CDN-Cache-Control': 'no-store',
            'Vary': 'Cookie',
        };
        if (request.headers.get('sec-fetch-dest') === 'document' || request.headers.get('accept')?.includes('text/html')) {
            const destination = new URL('/login.html', url.origin);
            destination.searchParams.set('next', url.pathname + url.search);
            return new Response(null, { status: 303, headers: { ...headers, Location: destination.href } });
        }
        return new Response('Login required.', { status: 401, headers });
    }

    const response = await context.next();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Netlify-CDN-Cache-Control', 'no-store');
    response.headers.append('Vary', 'Cookie');
    return response;
};

export const config: Config = { path: '/*' };
