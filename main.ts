// The Worst Line an AI Could Say — entry program.
// Reads the single pickup line from line.txt, validates it against the
// bounty gate (1-140 chars, one line, not only whitespace), and writes it
// to entry.txt in the output directory.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const linePath = join(here, "line.txt");

const raw = readFileSync(linePath, "utf8");
const line = raw.replace(/\r\n?/g, "\n");

// The entry must be exactly one line.
if (line.includes("\n")) {
  throw new Error("line.txt must contain a single line (found a newline)");
}
if (line.trim().length === 0) {
  throw new Error("line.txt must not be blank or only whitespace");
}
// Reject invisible control characters (other than the newline already
// handled above): the gate counts characters, and a stray control char
// would silently change what the judge sees.
if (/[\u0000-\u001F\u007F]/.test(line)) {
  throw new Error("line.txt must not contain control characters");
}
if (line.length < 1 || line.length > 140) {
  throw new Error(
    `line must be 1-140 characters, got ${line.length} characters`,
  );
}

// Output dir: MAKEFUN_OUTPUT_DIR first, then MAKEFUN_BOT_DIR, then ./output.
const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ||
  process.env.MAKEFUN_BOT_DIR ||
  join(here, "output");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
console.log(`Wrote ${line.length}-character line to ${join(outDir, "entry.txt")}`);
