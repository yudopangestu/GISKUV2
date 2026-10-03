import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/auth', { recursive: true });

for (const asset of ['index.html', 'login.html', 'resources', 'layers', 'styles', 'images', 'webfonts']) {
    await cp(asset, `dist/${asset}`, { recursive: true });
}

await cp('auth/login.css', 'dist/auth/login.css');
await build({
    entryPoints: ['auth/login.js', 'auth/map-session.js'],
    outdir: 'dist/auth',
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    minify: true,
});
