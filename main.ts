// Leonida Trophy Guide — the entry program (Node 22, standard library only).
//
// What it does: it takes the guide as it sits in this repository — the static
// app/ folder (index, styles, tracker scripts, trophy and roadmap data) and the
// screenshots/ folder — copies both into the output directory the grader
// provides, and writes /output/dossier.json with the vendored make.fun
// library, which is the summary the judge reads: the screenshots, the first
// load's files and bytes, and the entry's own source. The library file under
// vendor/ is the kit's copy and must stay untouched, so the dossier the
// scorer rebuilds from the same library matches this one byte for byte.
//
// The app itself is plain static files: serve app/ with any static server
// (the repo's serve.ts does it on http://localhost:8080) and open index.html.
// Nothing is fetched over the network at run time.
//
// Run it outside the grader with an output folder of your own:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fresh output directory, then the guide and its screenshots, copied whole.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier caps mirror the gate: at most 4 screenshots of 256 KiB each,
// app/ at most 993 files and 48 MiB, and the judge-view text at most 160 KiB.
// Only the text cap shapes the bytes; the rest refuse an entry the gate
// would refuse, so a build that passes here is one the gate can accept.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);

// A short build summary on stdout, so a local run shows what was handed in.
const dossierBytes = Buffer.byteLength(dossier, 'utf8');
console.log(`Leonida Trophy Guide: app/ + screenshots/ copied to ${outputDir}; dossier.json written (${dossierBytes} bytes).`);
