import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

for (const asset of ['index.html', 'resources', 'layers', 'styles', 'images', 'webfonts']) {
    await cp(asset, `dist/${asset}`, { recursive: true });
}
