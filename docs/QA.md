# Verification — 2026-10-14

## Automated checks

Original model checks: **7 / 7 pass**, using Node's built-in test runner (no installed dependencies).

1. All bundled records are marked sample; dates belong to the seed month; YouTube fields are empty.
2. Timetable day/class/teaching filtering and chronological ordering.
3. Current/next boundary behavior at start, end, gaps, breaks and empty days.
4. Calendar offsets/month lengths including leap years; date/category/month filtering.
5. HTTPS link safety and invalid time/day/progress/date/link validation.
6. Saved data round-trip and rejection of malformed data and duplicate IDs.
7. Asia/Bangkok date, weekday, time and month rollover.

`npm run check`: JavaScript syntax passes for app, model, and illustration modules.

## Browser interaction checks

Chrome, loopback HTTP preview:

- Default sample data renders; current time matches Bangkok; evening shows no-current/no-next empty states.
- A temporary sample activity from 00:00–23:59 appears in the current activity card. Its `<script>`-like title displays literally, rather than executing. Test record removed afterward.
- Today's activity completion toggles and survives reload.
- Teaching tab shows teaching preparation only; switching days changes activities.
- Exam filter shows only the example exam; next month shows November from October; “this month” returns to October.
- Selecting October 18 shows only that day's event; “view whole month” restores the month list.
- Project status changes to doing and progress updates; it survives reload.
- Parent project progress and latest-update text save and render.
- Parent interests: add → edit → confirm deletion passes.
- Parent calendar: add → confirm deletion passes.
- Parent schedule: end-before-start is rejected; valid temporary sample activity saves and can be deleted.
- `javascript:` interest URL is rejected with an inline error; blank optional URL saves.
- Modal has an accessible name, traps focus through native dialog behavior, and closes using Escape from a focused input. Escape closure was verified.
- Console captured after reload: no errors/warnings.
- Test-only records were removed and edited examples restored for final screenshots.

## Layout and accessibility inspection

Rendered and visually inspected at desktop default (~1473px), tablet 820×1180, mobile 390×844, and narrow mobile 320×800. DOM width checks: no horizontal document overflow at 320, 390, or 820. Tablet has two main panels; mobile stacks panels and changes project/interest cards into compact picture rows. Parent form fits the 390px screen (345px dialog).

Semantic inspection confirms one h1, named navigation, native buttons with pressed state, labeled input/select fields, named dialogs, labeled progress bars, sample disclaimers, text event categories, and aria-current on today's calendar cell. Illustrations are decorative and aria-hidden; their visible names remain available as text. Focus rings and keyboard Escape were checked. Most controls have at least 44px targets; reduced-motion CSS is present. This is manual accessibility QA, not a complete screen-reader or WCAG audit.

Screenshots: `desktop.jpg`, `tablet.jpg`, `mobile.jpg`, and `editor.jpg` (generic sample data only). They are captures of the working app, not mockups.

## Known limits / pending

- Private `worldlab-club/dashboard-v2` was created using the independently verified World Lab browser session. Existing `github-worldlab` SSH authenticates as `worldlab-club`; main is delivered through this route. Repository visibility and remote main commit are verified during handoff. No personal account is used.
- No public hosting enabled. Existing site remains untouched.
- Daily schedules, holidays, exam dates, course enrollment, hobby status and current interests still require confirmation. The term date range has since been parent-confirmed; see PROVENANCE.md. YouTube sources require parent curation.
- Local-only data has no cross-device sync, authenticated separation, backup or import/export.
- Schedule items recur weekly in one-day views. Overnight lessons and overlapping lessons are not specially modeled; current focus picks the first matching activity chronologically.
- No testing against Safari, Firefox, actual screen-reader software, or storage-quota failure injection was performed. Storage failure recovery exists in code and is disclosed.

## Private baseline and safe demo update — 2026-10-14

Default profile contains parent-confirmed school term start/end and three existing World Lab resources with source/scope. No daily times, course enrollment, exams or hobby status were inferred. New tests validate that baseline, deep-copy isolation, separate storage keys, and a six-file demo export with no private module, school facts, source docs or stale private output. The original seven model scenarios remain applicable to demo behavior.

Hosting readiness: GitHub Pages Settings for the private repository says “Upgrade or make this repository public to enable Pages”. No free GitHub Pages route preserving this private repository is available on the current plan. Private Pages audience requires an organization on Enterprise Cloud; a private source repo alone does not make a site family-only. No plan purchase, permission grant, visibility change or hosting deployment was performed. Separate sample-only demo output is prepared locally, not hosted.

## Public release authorization and audit — 2026-10-14

After the private-plan Pages restriction and public audience were explained, the parent explicitly requested public access. Only dashboard-v2 is changed to public and deployed through GitHub Pages. The default profile contains the confirmed term and existing World Lab resources; unknown times, course enrollment, holidays, exams and hobby status remain unknown. Audit of tracked files and reachable commit trees checks for secret material and unintended account/family identifiers before visibility changes. No unrelated personal records are included. The existing dashboard is untouched.
