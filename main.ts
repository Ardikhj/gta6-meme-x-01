// gta6-meme-x-01 entry (Node 22, standard library only).
//
// This program has exactly one job: hand POST.json from the repository to
// the grader's output directory. The post itself is the entry — the house
// reads the X post (its first picture, then its text) and an AI judge
// ranks it against the other posts. Nothing this program writes is judged,
// so it stays tiny on purpose.
//
// POST.json still holds the placeholder address until the meme is posted on
// X; the post's real address replaces it before submission.
//
// Local test:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const post = readFileSync(join(botDir, "POST.json"));
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), post);
console.log("POST.json written to " + join(outDir, "POST.json"));
