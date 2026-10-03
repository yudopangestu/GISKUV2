import { getIdentityConfig } from '@netlify/identity';
import { isAllowedEmail } from './account.ts';

export async function isAuthorizedRequest(request: Request): Promise<boolean> {
    const cookie = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith('nf_jwt='));
    if (!cookie) return false;
    try {
        const token = decodeURIComponent(cookie.slice('nf_jwt='.length));
        const identity = getIdentityConfig();
        if (!token || !identity?.url) return false;
        const response = await fetch(`${identity.url.replace(/\/$/, '')}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) return false;
        const user = await response.json();
        return Boolean(user.confirmed_at) && await isAllowedEmail(user.email);
    } catch {
        return false;
    }
}
