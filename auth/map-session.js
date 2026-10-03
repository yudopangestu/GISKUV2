import { getUser, hydrateSession, logout, onAuthChange } from '@netlify/identity';

const callbackParameters = new URLSearchParams(location.hash.slice(1));
if (['confirmation_token', 'recovery_token', 'invite_token', 'email_change_token'].some((name) => callbackParameters.has(name))) {
    location.replace('/login.html' + location.hash);
} else {
    const user = await hydrateSession();
    if (!user) {
        location.replace('/login.html');
    } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sign-out-button';
        button.textContent = 'Keluar';
        button.setAttribute('aria-label', 'Keluar dari akun');
        document.body.append(button);
        button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = 'Keluar…';
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'logout' }),
                    credentials: 'same-origin',
                });
                if (!response.ok) throw new Error('Logout failed');
                await logout();
                location.replace('/login.html');
            } catch {
                button.disabled = false;
                button.textContent = 'Coba keluar lagi';
            }
        });
        onAuthChange((event) => {
            if (event === 'logout') location.replace('/login.html');
        });
        window.addEventListener('pageshow', async (event) => {
            if (event.persisted && !await getUser()) location.replace('/login.html');
        });
    }
}
