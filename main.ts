// GTA VI Trophy Guide & Tracker — hand-in program (Node 22, stdlib only).
//
// What it does: copies this repository's app/ and screenshots/ into the
// output directory and writes output/dossier.json with the vendored make.fun
// library, so the scorer can check the entry and the judge can read it.
// vendor/makefun-frontend.ts is the kit's copy and is left untouched.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice into two directories and diff them: both runs must agree.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyEntry() {
  if (!existsSync(join(repoRoot, "app"))) {
    throw new Error("app/ is missing from the repository");
  }
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });
  mkdirSync(join(outputDir, "screenshots"), { recursive: true });
  if (existsSync(join(repoRoot, "screenshots"))) {
    cpSync(join(repoRoot, "screenshots"), join(outputDir, "screenshots"), {
      recursive: true,
    });
  }
}

function writeDossier() {
  // The scorer's own caps: the text cap shapes the dossier bytes, and the
  // other limits refuse an entry the scorer would refuse (more than 4
  // screenshots, one over 256 KiB, or app/ past 993 entries / 48 MiB).
  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outputDir, "dossier.json"), dossier);
}

copyEntry();
writeDossier();
