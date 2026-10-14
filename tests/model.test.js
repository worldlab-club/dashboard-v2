import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  validateData,
  validate,
  lessons,
  focus,
  eventList,
  monthCells,
  safeUrl,
  bangkok,
} from "../model.js";
test("sample dates are labelled examples and relative to the demonstration month", () => {
  const d = validateData(seed("2026-10-14"));
  for (const c of ["schedule", "events", "projects", "interests"])
    assert(d[c].every((r) => r.sample));
  assert(d.events.every((e) => e.date.startsWith("2026-10")));
  assert(d.interests.every((i) => i.url === ""));
});
test("day/class/teaching filters isolate correct activities and order by time", () => {
  const d = seed();
  assert.deepEqual(
    lessons(d, 1).map((r) => r.start),
    ["09:00", "10:00", "10:40"],
  );
  assert.equal(lessons(d, 1, "class").length, 2);
  assert.equal(lessons(d, 3, "teach")[0].id, "s10");
  assert.equal(lessons(d, 0).length, 0);
});
test("current/next obey start-inclusive end-exclusive boundaries and breaks", () => {
  const d = seed();
  assert.equal(focus(d, "09:00", 1).now.id, "s1");
  assert.equal(focus(d, "09:40", 1).now, null);
  assert.equal(focus(d, "09:40", 1).next.id, "s2");
  assert.equal(focus(d, "10:40", 1).now.id, "s3");
  assert.equal(focus(d, "11:00", 1).next, null);
  assert.equal(focus(d, "08:00", 0).now, null);
});
test("calendar month length, weekday offset, leap years and event filters", () => {
  assert.deepEqual(monthCells("2026-10"), { offset: 4, count: 31 });
  assert.equal(monthCells("2028-02").count, 29);
  assert.equal(monthCells("2027-02").count, 28);
  const d = seed("2026-10-14");
  assert.equal(eventList(d, "2026-10", "exam")[0].date, "2026-10-23");
  assert.equal(eventList(d, "2026-10", "all", "2026-10-18").length, 1);
  assert.equal(eventList(d, "2026-11").length, 0);
});
test("unsafe links and invalid forms are rejected; https links accepted", () => {
  for (const u of [
    "javascript:alert(1)",
    "http://example.com",
    "data:text/html,hi",
    "https://u:p@example.com",
    "not a url",
  ])
    assert.equal(safeUrl(u), null);
  assert.equal(
    safeUrl("https://www.youtube.com/@NASA"),
    "https://www.youtube.com/@NASA",
  );
  const d = seed();
  assert.throws(() => validate("schedule", { ...d.schedule[0], end: "08:00" }));
  assert.throws(() => validate("schedule", { ...d.schedule[0], day: 7 }));
  assert.throws(() =>
    validate("projects", { ...d.projects[0], progress: 101 }),
  );
  assert.throws(() =>
    validate("events", { ...d.events[0], date: "2026-02-31" }),
  );
  assert.throws(() =>
    validate("interests", { ...d.interests[0], url: "javascript:alert(1)" }),
  );
});
test("saved data validates and round-trips; malformed local data fails safely", () => {
  const d = seed();
  assert.deepEqual(validateData(JSON.parse(JSON.stringify(d))), d);
  assert.throws(() => validateData({ version: 1 }));
  assert.throws(() =>
    validateData({ ...d, schedule: [d.schedule[0], d.schedule[0]] }),
  );
});
test("Bangkok clock uses UTC+7 including day/month rollover", () => {
  assert.deepEqual(bangkok(new Date("2026-10-31T18:05:00Z")), {
    date: "2026-11-01",
    time: "01:05",
    day: 0,
    month: "2026-11",
  });
});
