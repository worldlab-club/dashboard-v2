# World Lab Dashboard v2

A Thai, picture-first learning dashboard with original SVG illustrations, small labels, and a calm World Lab palette. This is a **new, separate project**. The existing `worldlab-club/dashboard` website is unchanged.

## Run locally

Requires Python 3; Node.js 18+ is only needed for tests. There are no npm dependencies and no build step.

```sh
cd dashboard-v2
npm start
# Open http://127.0.0.1:4173
```

Or run `python3 -m http.server 4173 --bind 127.0.0.1`. Serve over HTTP: opening `index.html` as a `file://` URL will not load JavaScript modules reliably.

```sh
npm test
npm run check
```

## Ready in the MVP

- Large illustrated current / next activity cards, with Asia/Bangkok time and honest empty states outside lesson hours.
- Weekly recurring timetable with day selection and daily / class / teaching filters. Completion ticks are stored separately per calendar date and retained for up to 31 days.
- Month calendar, previous / next / current month, date selection, holidays / important dates / exams filters, and text labels alongside colored markers.
- Illustrated hobby projects with details, latest update text, progress percentage, and idea / doing / done status controls.
- Interests cards with optional HTTPS educational links. **YouTube links start unconfigured**; a parent should choose and verify official age-appropriate sources. There are no invented video IDs, autoplay players, embeds, APIs, or API keys.
- Links to existing World Lab learning apps. They open only when selected.
- Parent corner: add, edit, and explicitly confirm deletion in each category; choose picture, schedule day/type/time, event date/type, project status/progress/update, interest link, and example/personal label.
- Responsive mobile, tablet and desktop layout, Thai labels, keyboard-operable native controls, modal dialogs with names and Escape dismissal, focus rings, skip link, reduced-motion support, and labeled progress indicators.

## Sample data and privacy

**All bundled schedules, calendar dates, exams, hobby statuses, and interests are examples.** Demo calendar items are placed on days 10, 18, and 23 of the browser's first-run Bangkok month. Those dates do not represent real school holidays or exams. The UI repeats this disclosure. No worksheet handwriting was used as a real timetable.

The parent editor stores changes in `localStorage` under `worldlab-dashboard-v2.1`, only for this browser profile and origin. It does not write to source files or GitHub, sync devices, or provide an authenticated parent account. Anyone using the same browser profile can see or change those records. Clearing site data, switching origins/ports, or private browsing can lose edits. Storage failures show a visible warning. There is no cloud backup/export in this MVP.

Do not commit real child schedules, school records, private photos, or identifying family data. Keep the default generic example content in the repository. Enter personal records only in the local editor. Screenshots in `docs/` show generic samples only. The app loads no external fonts, images, analytics, weather, or scripts; CSP blocks network connections. External learning links leave the app when clicked and are governed by those services' privacy policies.

## Repository and hosting status

Repository: **[worldlab-club/dashboard-v2](https://github.com/worldlab-club/dashboard-v2)** · visibility **Private** · branch **main**.

Created on 2026-10-14 using the independently verified **worldlab-club** GitHub browser session. The repository owner and Private badge were checked after creation. No personal GitHub account was used for repository creation or Git writes.

Git transport uses the existing World Lab SSH alias:

```sh
git remote -v
# origin git@github-worldlab:worldlab-club/dashboard-v2.git
```

Live SSH verification returned “Hi worldlab-club! You've successfully authenticated”. No private key contents or token stores were read or copied, and no new credentials or access grants were created. On another machine use your own already-authorized World Lab Git connection; the alias is specific to this configured machine.

**Hosting is not enabled.** There is no GitHub Pages workflow or deployment configuration. The original `worldlab-club/dashboard` remains unchanged. Keep child data in browser-local edits; only generic example code/data belongs in this repository. Enable hosting only after a separate explicit decision about audience and data.

## Design references and structure

Inspected [original dashboard](https://worldlab-club.github.io/dashboard/) and its [index.html source](https://github.com/worldlab-club/dashboard/blob/main/index.html) at public commit `aa20ff7087ada3256e4a47684e5a147e5c353f8e`. The old repo contains one HTML file and no README or AGENTS.md. This project retains the warm background and World Lab green/yellow/orange/blue palette, buildless HTML approach, and widget focus. It uses its own original SVG artwork and a local system Thai font instead of remote assets or the old external weather/navigation scripts.

- `index.html` — semantic page and modal shells, CSP
- `styles.css` — palette, illustrated card layouts, responsive breakpoints
- `art.js` — original inline SVG picture vocabulary
- `model.js` — samples, timezone logic, filters, validation
- `app.js` — UI, local persistence, editor, status updates
- `tests/model.test.js` — seven model test scenarios
- `docs/QA.md` — verification evidence and limitations

![Desktop sample dashboard](docs/desktop.jpg)
