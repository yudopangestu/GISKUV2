import { acceptInvite, getUser, handleAuthCallback, logout, updateUser } from '@netlify/identity';

const form = document.getElementById('login-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmation = document.getElementById('confirm-password');
const submit = document.getElementById('submit-button');
const message = document.getElementById('form-message');
let mode = 'login';
let inviteToken = null;
let busy = false;

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('error', isError);
}

function setMode(nextMode) {
    mode = nextMode;
    const setup = mode === 'signup';
    const recovery = mode === 'recovery';
    const reset = mode === 'reset' || mode === 'invite';
    document.getElementById('username-field').hidden = recovery || reset;
    document.getElementById('email-field').hidden = !setup && !recovery;
    document.getElementById('password-field').hidden = recovery;
    document.getElementById('confirm-field').hidden = !setup && !reset;
    username.required = !recovery && !reset;
    email.required = setup || recovery;
    password.required = !recovery;
    confirmation.required = setup || reset;
    password.autocomplete = setup || reset ? 'new-password' : 'current-password';
    password.value = '';
    confirmation.value = '';
    document.getElementById('forgot-password').hidden = mode !== 'login';
    document.getElementById('setup-account').hidden = mode !== 'login';
    document.getElementById('back-to-login').hidden = mode === 'login';
    document.getElementById('form-title').textContent = setup ? 'Aktivasi akun.' : recovery ? 'Pulihkan akses.' : reset ? 'Kata sandi baru.' : 'Selamat datang.';
    document.getElementById('form-description').textContent = setup ? 'Gunakan ID pengguna dan email yang telah diizinkan. Konfirmasi akun melalui email.' : recovery ? 'Masukkan email akun untuk menerima tautan pemulihan.' : reset ? 'Tetapkan kata sandi untuk mengakses peta Anda.' : 'Masuk dengan ID pengguna untuk membuka peta.';
    submit.textContent = setup ? 'Aktivasi akun →' : recovery ? 'Kirim tautan pemulihan →' : reset ? 'Simpan kata sandi →' : 'Masuk ke peta →';
    showMessage('');
}

async function requestAuth(body) {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
    });
    const result = await response.json().catch(() => ({ message: 'Layanan tidak tersedia. Silakan coba lagi.' }));
    if (!response.ok) throw new Error(result.message);
    return result;
}

function destination() {
    const candidate = new URLSearchParams(location.search).get('next');
    if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) return '/';
    try {
        const target = new URL(candidate, location.origin);
        if (target.origin !== location.origin || ['/login', '/login.html'].includes(target.pathname) || target.pathname.startsWith('/api/') || target.pathname.startsWith('/.netlify/')) return '/';
        return target.pathname + target.search;
    } catch {
        return '/';
    }
}

async function enterMap() {
    const response = await fetch('/api/auth', { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) {
        await logout();
        throw new Error('Akun ini tidak diizinkan mengakses peta.');
    }
    location.replace(destination());
}

function setBusy(value) {
    busy = value;
    form.setAttribute('aria-busy', String(value));
    for (const button of document.querySelectorAll('button')) button.disabled = value;
}

document.getElementById('setup-account').addEventListener('click', () => setMode('signup'));
document.getElementById('forgot-password').addEventListener('click', () => setMode('recovery'));
document.getElementById('back-to-login').addEventListener('click', async () => {
    setBusy(true);
    try {
        if (mode === 'reset') await logout();
        inviteToken = null;
        setMode('login');
    } catch {
        showMessage('Tidak dapat keluar. Muat ulang halaman dan coba lagi.', true);
    } finally {
        setBusy(false);
    }
});
document.getElementById('toggle-password').addEventListener('click', (event) => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    event.currentTarget.textContent = visible ? 'Sembunyi' : 'Lihat';
    event.currentTarget.setAttribute('aria-pressed', String(visible));
    event.currentTarget.setAttribute('aria-label', visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    if (['signup', 'reset', 'invite'].includes(mode) && password.value !== confirmation.value) {
        showMessage('Konfirmasi kata sandi tidak cocok.', true);
        return;
    }
    const originalLabel = submit.textContent;
    setBusy(true);
    submit.textContent = 'Memproses…';
    showMessage('');
    try {
        if (mode === 'invite') {
            await acceptInvite(inviteToken, password.value);
            inviteToken = null;
            await enterMap();
        } else if (mode === 'reset') {
            await updateUser({ password: password.value });
            await enterMap();
        } else {
            const result = await requestAuth({ action: mode, username: username.value, email: email.value, password: password.value });
            if (mode === 'login') {
                await enterMap();
            } else {
                setMode('login');
                showMessage(result.message);
            }
        }
    } catch (error) {
        showMessage(error.message || 'Tidak dapat masuk. Silakan coba lagi.', true);
    } finally {
        password.value = '';
        confirmation.value = '';
        setBusy(false);
        if (submit.textContent === 'Memproses…') submit.textContent = originalLabel;
    }
});

setBusy(true);
try {
    const callback = await handleAuthCallback();
    if (callback?.type === 'invite') {
        inviteToken = callback.token;
        setMode('invite');
    } else if (callback?.type === 'recovery') {
        setMode('reset');
    } else if (callback?.user || await getUser()) {
        await enterMap();
    }
} catch {
    showMessage('Tautan atau sesi tidak valid. Masuk kembali atau minta tautan pemulihan baru.', true);
} finally {
    setBusy(false);
}
