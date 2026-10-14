import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { profile, initialData } from "../dashboard-data.js";
import { validateData, eventList, KEY } from "../model.js";
const root = fileURLToPath(new URL("../", import.meta.url));
test("confirmed baseline contains only confirmed term dates, no invented lessons/exams/hobby status", () => {
  const d = validateData(initialData());
  assert.equal(profile.real, true);
  assert.equal(profile.term.start, "2026-10-05");
  assert.equal(profile.term.end, "2027-01-22");
  assert.equal(d.schedule.length, 0);
  assert.equal(d.projects.length, 0);
  assert.equal(d.events.length, 2);
  assert(
    d.events.every(
      (e) =>
        e.kind === "important" &&
        !e.sample &&
        e.provenance.source.includes("ผู้ปกครอง"),
    ),
  );
  assert.equal(eventList(d, "2026-10", "exam").length, 0);
  assert.equal(eventList(d, "2027-01")[0].date, "2027-01-22");
  assert(d.interests.every((i) => i.provenance.scope.includes("ไม่ยืนยัน")));
});
test("confirmed initial data is isolated from mutations and legacy sample storage", () => {
  const a = initialData();
  a.events[0].date = "2099-01-01";
  assert.equal(initialData().events[0].date, "2026-10-05");
  assert.notEqual(`${KEY}-${profile.id}`, KEY);
  assert.notEqual(`${KEY}-${profile.id}`, `${KEY}-public-sample-r1`);
});
test("public demo export strips private data, stale private files, docs and imports", async () => {
  await mkdir(new URL("../dist-demo/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../dist-demo/dashboard-data.js", import.meta.url),
    "sensitive stale test fixture",
  );
  execFileSync(process.execPath, ["scripts/build-demo.mjs"], { cwd: root });
  const names = (
    await readdir(new URL("../dist-demo/", import.meta.url))
  ).sort();
  assert.deepEqual(names, [
    "app.js",
    "art.js",
    "assets",
    "data-profile.js",
    "index.html",
    "model.js",
    "styles.css",
  ]);
  for (const name of names.filter((n) => n !== "assets")) {
    const content = await readFile(
      new URL(`../dist-demo/${name}`, import.meta.url),
      "utf8",
    );
    assert(
      !/dashboard-data\.js|SSIS|Primary 1|2026-10-05|2027-01-22|sensitive stale/.test(
        content,
      ),
      name,
    );
  }
  const entry = await readFile(
    new URL("../dist-demo/data-profile.js", import.meta.url),
    "utf8",
  );
  assert(entry.includes("real:false"));
  assert(entry.includes("return seed()"));
  assert(entry.includes("public-sample-r1"));
  const css = await readFile(
    new URL("../dist-demo/assets/fonts/fonts.css", import.meta.url),
    "utf8",
  );
  assert(!css.includes("https://"));
  const logo = await readFile(
    new URL("../dist-demo/assets/world-lab-logo.png", import.meta.url),
  );
  assert(logo.length > 1000);
});
