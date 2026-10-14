import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist-demo");
await mkdir(output, { recursive: true });
// Exact allowlist: never copy the repo root, docs, saved browser data or real-data modules.
for (const file of [
  "index.html",
  "styles.css",
  "app.js",
  "model.js",
  "art.js",
]) {
  await copyFile(resolve(root, file), resolve(output, file));
}
await writeFile(
  resolve(output, "data-profile.js"),
  `import {seed} from './model.js';\nexport const profile={id:'public-sample-r1',real:false,label:'ข้อมูลตัวอย่างทั้งหมด'};\nexport function initialData(){return seed();}\n`,
);
const { readdir, rm } = await import("node:fs/promises");
const allowed = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "model.js",
  "art.js",
  "data-profile.js",
]);
// Remove anything unexpected from the generated output only, including stale private files.
for (const file of await readdir(output)) {
  if (!allowed.has(file))
    await rm(resolve(output, file), { recursive: true, force: true });
}
for (const file of allowed) {
  const content = await readFile(resolve(output, file), "utf8");
  if (
    /dashboard-data\.js|SSIS|Primary 1|2026-10-05|2027-01-22/i.test(content)
  ) {
    throw new Error(`Private-data audit failed: ${file}`);
  }
}
console.log(
  "Prepared sample-only demo in dist-demo/; private data excluded. NOT deployed.",
);
