# Simultaneous interface languages and Chinese learning

English is primary, with smaller Thai and Simplified Chinese directly underneath. All are shown together; the language selector is removed. The old `worldlab-ui-language-v1` preference is never read, so it cannot hide a language. Personal data keys and stored records are unchanged. Date values use English formatting; calendar weekday labels show all three languages. World Lab brand names remain intact.

The 183 fixed-label catalog entries cover headings, navigation, filters, empty states, privacy notices, parent editor labels, validation and status controls. Thai translations are supplied for the English interface captions too. English label text is larger or bolder; secondary labels are at least 13px, with larger type for the hero/headings. No language is shown only on hover.

Records, baseline titles/notes, term metadata and source evidence keep their original text, as disclosed on the page. No unknown personal record is automatically translated. Input and textarea values and `data-original` render boundaries are excluded. There is no remote translation service or child-data transmission.

Native select menus show the three names inline because HTML option rows do not support stacked markup. The selected option is also displayed in a fully wrapped English / Thai / Chinese stack below the control, so long labels can be read at mobile widths. Native date/time picker internals follow browser conventions. Dates and numeric values are data, not translated vocabulary.

## Learning interaction

Underlined Chinese words are real buttons. Whole-word dictionary entries are preferred to single-character readings. Non-action headings can contain word buttons; for navigation and filter labels, Chinese learning buttons are separate siblings outside the original action. English/Thai navigation or filter activation remains direct. There are no nested interactive buttons/links. The always-available vocabulary panel contains all **42 contextual words**.

Each modal preserves Simplified, Traditional, tone-marked pinyin, Thai/English whole-word meanings, then per-character in-word readings and glosses. Notes flag polyphony and simplified/traditional ambiguity. The popup is intentionally a Chinese learning object, rather than a translated record. Tap/click, Enter/Space, close button, Escape, backdrop dismissal and return focus are supported. Native modal background inertness and viewport-limited internal scrolling remain.

## Sources and editorial limits

- Readings, contextual word meanings and Traditional word forms checked on 2026-10-14 against [CC-CEDICT / MDBG](https://www.mdbg.net/chinese/dictionary?page=cedict), using its [official current UTF-8 export](https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz). The full dictionary is not bundled. Short teaching glosses, Thai meanings and UI translations are manually curated for this dashboard.
- Both script forms are explicit per word; there is no blanket character converter. Readings and glosses are contextual, not exhaustive dictionary entries. Mandarin standard readings are used, with neutral tones shown where appropriate; regional pronunciation and connected-speech tone changes are not exhaustive.
- Noto Sans CJK SC Regular from the official [Noto CJK repository](https://github.com/notofonts/noto-cjk/tree/main/Sans) is self-hosted and includes both Simplified and Traditional glyphs. Its SIL Open Font License is included. This full font is approximately 16 MiB, fetched from this site only when needed and browser-cacheable. Existing Thai/Latin brand typography stays intact.
- This is a curated 42-word learning set, not arbitrary Chinese segmentation, machine translation, pronunciation audio, or a comprehensive Chinese course. Unknown record text has no generated reading/translation.

## Verification

13 automated tests cover the full catalog, simultaneous language parts, absence of any preference read / selector, 42-word coverage, contextual readings/forms, existing data/model validation and sample-only export isolation. Syntax and sample export checks pass.

Local browser at 320px, 390px and desktop: three languages visible with the prior saved Chinese preference still present; no horizontal overflow; secondary text measures 13–16px. Headings, action groups, calendar weekday labels and long form labels reviewed. Native selected-option previews wrap without widening dialogs. No nested buttons/links. Picture-first current/next widgets are above navigation and parent provenance details.

Verified tap and Enter opening from the actual Chinese text, Escape, close/reopen, backdrop dismissal and focus return. Chinese 课程表 learning action did not alter the active Classes filter. Created a sample title `QA stacked วันนี้ 学校` and note `เรียน 保存 — original text`; both remained verbatim after saving/reload. Completion, calendar filtering, project status and edit/delete passed. Test records were removed via UI and never committed. No console warnings/errors.

Entry CSS/font CSS/script and changed module dependencies are versioned for this release to avoid pairing new markup with the old cached language-switching module. Previously open pages may need a normal reload for current HTML.
