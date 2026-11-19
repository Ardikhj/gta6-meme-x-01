// gta6-meme-x-01 entry (Node 22, standard library only).
//
// This program has exactly one job: hand POST.json from the repository to
// the grader's output directory. The post itself is the entry — the house
// reads the X post (its first picture, then its text) and an AI judge
// ranks it against the other posts. Nothing this program writes is judged,
// so it stays tiny on purpose.
//
// POST.json holds the real address of the meme post on X
// (https://x.com/Ardi3018/status/2123465529428193496). Before copying it,
// the program validates the address shape, strips any tracking query
// parameters (e.g. the ?a=...&s=19 a shared link carries), and checks the
// written output back — a malformed address fails loudly instead of
// handing the grader a broken link.
//
// Local test:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// An X post address: https://x.com/<handle>/status/<digits>
// (twitter.com accepted too — it is the same post). A shared link may
// carry tracking query parameters (?a=...&s=19); those are stripped below.
// Anything else is not a post the house can read, so refuse it instead
// of copying it through.
const POST_PATH = /^\/([A-Za-z0-9_]{1,15})\/status\/(\d+)$/;

const raw = readFileSync(join(botDir, "POST.json"), "utf8");
const parsed = JSON.parse(raw) as { url?: unknown };
if (typeof parsed.url !== "string") {
  throw new Error('POST.json must hold {"url": "https://x.com/<handle>/status/<digits>"}, got: ' + JSON.stringify(parsed));
}
const url = new URL(parsed.url);
if (url.protocol !== "https:" || (url.hostname !== "x.com" && url.hostname !== "twitter.com") || !POST_PATH.test(url.pathname)) {
  throw new Error(
    'POST.json must hold {"url": "https://x.com/<handle>/status/<digits>"}, got: ' + JSON.stringify(parsed),
  );
}

// Canonical form: x.com host, no tracking query parameters.
url.hostname = "x.com";
url.search = "";
const clean = { url: url.toString() };

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "POST.json");
// Same layout as POST.json itself: one line, space after the colon.
writeFileSync(outPath, '{"url": "' + clean.url + '"}');

// Check the written output back: it must exist, be non-empty, and parse
// to the same canonical address we validated above.
if (!existsSync(outPath) || statSync(outPath).size === 0) {
  throw new Error("failed to write " + outPath);
}
const written = JSON.parse(readFileSync(outPath, "utf8")) as { url?: unknown };
if (written.url !== clean.url) {
  throw new Error("output check failed: " + outPath + " does not hold " + clean.url);
}
console.log("POST.json written to " + outPath);
