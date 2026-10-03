import { admin, AuthError, login, logout, MissingIdentityError, requestPasswordRecovery, signup, verifyRequestOrigin } from '@netlify/identity';
import type { Config } from '@netlify/functions';
import { isAllowedEmail, isAllowedUsername } from '../lib/account.ts';
import { isAuthorizedRequest } from '../lib/session.ts';

function reply(message: string, status = 200) {
    return Response.json({ message }, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

async function findAccountEmail(): Promise<string | null> {
    for (let page = 1; page <= 10; page += 1) {
        const users = await admin.listUsers({ page, perPage: 100 });
        for (const user of users) {
            if (await isAllowedEmail(user.email)) return user.email ?? null;
        }
        if (users.length < 100) break;
    }
    return null;
}

export default async (request: Request) => {
    if (request.method === 'GET') {
        const authorized = await isAuthorizedRequest(request);
        return reply(authorized ? 'Signed in.' : 'Login required.', authorized ? 200 : 401);
    }
    if (request.method !== 'POST') return reply('Method not allowed.', 405);

    try {
        verifyRequestOrigin(request);
        if (!request.headers.get('content-type')?.startsWith('application/json')) return reply('JSON is required.', 415);
        if (Number(request.headers.get('content-length')) > 16384) return reply('Request too large.', 413);
        const rawBody = await request.text();
        if (rawBody.length > 16384) return reply('Request too large.', 413);
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return reply('Invalid request.', 400);
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) return reply('Invalid request.', 400);

        if (body.action === 'logout') {
            await logout();
            return reply('Signed out.');
        }

        if (body.action === 'recovery') {
            if (await isAllowedEmail(body.email)) await requestPasswordRecovery(body.email.trim().toLowerCase());
            return reply('If this is the authorized account, a password reset link has been sent.');
        }

        if (!await isAllowedUsername(body.username)) return reply('Invalid user ID or password.', 401);
        if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 256) return reply('Use a password between 8 and 256 characters.', 400);

        if (body.action === 'signup') {
            if (!await isAllowedEmail(body.email)) return reply('Account setup is restricted to the authorized email address.', 403);
            const user = await signup(body.email.trim().toLowerCase(), body.password, { full_name: body.username.trim() });
            if (user.confirmedAt) {
                await logout();
                return reply('Account created. Sign in with your user ID.');
            }
            return reply('Check your email and confirm your account before signing in.');
        }

        if (body.action === 'login') {
            const email = await findAccountEmail();
            if (!email) return reply('Invalid user ID or password. Complete account setup if this is your first visit.', 401);
            await login(email, body.password);
            return reply('Signed in.');
        }

        return reply('Invalid request.', 400);
    } catch (error) {
        if (error instanceof MissingIdentityError) return reply('Login is not enabled yet. Try again after deployment.', 503);
        if (error instanceof AuthError) {
            if (error.status === 429) return reply('Too many attempts. Please try again later.', 429);
            if (error.status === 403) return reply('The request was refused. Use this site’s login page or contact the site owner.', 403);
            return reply('Sign-in or account setup failed. Check your details and email confirmation, then try again.', 400);
        }
        return reply('Login is temporarily unavailable. Please try again later.', 503);
    }
};

export const config: Config = { path: '/api/auth' };
