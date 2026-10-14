import {
  mkdir,
  readFile,
  writeFile,
  copyFile,
  readdir,
  rm,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url)),
  output = resolve(root, "dist-demo");
const sourceFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "model.js",
  "art.js",
];
const brandFiles = [
  "assets/world-lab-logo.png",
  "assets/fonts/fonts.css",
  "assets/fonts/dm-sans-400.ttf",
  "assets/fonts/dm-sans-600.ttf",
  "assets/fonts/dm-sans-700.ttf",
  "assets/fonts/noto-sans-thai-400.ttf",
  "assets/fonts/noto-sans-thai-600.ttf",
  "assets/fonts/noto-sans-thai-700.ttf",
  "assets/fonts/sanchez-400.ttf",
  "assets/fonts/dmsans-OFL.txt",
  "assets/fonts/notosansthai-OFL.txt",
  "assets/fonts/sanchez-OFL.txt",
];
await mkdir(output, { recursive: true });
// Clean only generated output, then copy the exact app + verified CI asset allowlist.
for (const file of await readdir(output))
  await rm(resolve(output, file), { recursive: true, force: true });
for (const file of [...sourceFiles, ...brandFiles]) {
  await mkdir(dirname(resolve(output, file)), { recursive: true });
  await copyFile(resolve(root, file), resolve(output, file));
}
await writeFile(
  resolve(output, "data-profile.js"),
  `import {seed} from './model.js';\nexport const profile={id:'public-sample-r1',real:false,label:'ข้อมูลตัวอย่างทั้งหมด'};\nexport function initialData(){return seed();}\n`,
);
for (const file of [
  ...sourceFiles,
  "data-profile.js",
  "assets/fonts/fonts.css",
]) {
  const content = await readFile(resolve(output, file), "utf8");
  if (/dashboard-data\.js|SSIS|Primary 1|2026-10-05|2027-01-22/i.test(content))
    throw Error(`Confirmed-data audit failed: ${file}`);
}
console.log(
  "Prepared sample-only demo with verified CI assets in dist-demo/; confirmed data excluded. NOT deployed.",
);
