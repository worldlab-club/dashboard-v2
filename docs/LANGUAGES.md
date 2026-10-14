# English interface with Thai and Chinese titles

English is primary throughout. Only fixed H1/H2/H3 page, section and widget titles show smaller Thai and Simplified Chinese underneath. Supporting copy, captions, notices, buttons, form labels/options, calendar weekday labels, dates/time and status details are English-only. Brand names remain intact. No language selector is present and the legacy preference is never read. This replaces the dense all-label presentation.

The 183-entry translation catalog remains available internally. Localization only adds a three-language stack inside headings; body text and accessibility labels use English. Input/textarea values and `data-original` boundaries remain excluded. Record titles, notes, term metadata and source evidence retain their original language rather than generating unknown translations. Data storage keys and records are unchanged. Dates use English formatting and the clock remains Asia/Bangkok.

## Chinese learning on titles

Underlined Chinese title words are independent buttons. Whole-word meaning appears before per-character information: Simplified, Traditional, tone-marked pinyin, Thai/English meanings and contextual character readings. The 42-word curated dictionary remains, with popups offered where a remaining title contains a dictionary entry. There is no longer a separate vocabulary drawer or learning target on menu actions. Unknown phrases are not automatically segmented or translated.

Popup learning content intentionally contains Chinese forms and Thai/English meanings, while popup controls and explanatory labels use English. Tap/click or Enter/Space opens a word card. Close, Escape and backdrop click dismiss it; focus returns to its connected opener. Long cards remain viewport-limited with internal scrolling. Navigation/filter controls contain no learning button and execute their original actions directly.

## Sources and editorial limits

- Readings, contextual word meanings and Traditional word forms checked on 2026-10-14 against [CC-CEDICT / MDBG](https://www.mdbg.net/chinese/dictionary?page=cedict), using its [official current UTF-8 export](https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz). The full dictionary is not bundled. Short teaching glosses, Thai meanings and UI translations are manually curated for this dashboard.
- Both script forms are explicit per word; there is no blanket character converter. Readings and glosses are contextual, not exhaustive dictionary entries. Mandarin standard readings are used, with neutral tones shown where appropriate; regional pronunciation and connected-speech tone changes are not exhaustive.
- Noto Sans CJK SC Regular from the official [Noto CJK repository](https://github.com/notofonts/noto-cjk/tree/main/Sans) is self-hosted and includes both Simplified and Traditional glyphs. Its SIL Open Font License is included. This full font is approximately 16 MiB, fetched from this site only when needed and browser-cacheable. Existing Thai/Latin brand typography stays intact.
- This is a curated 42-word learning set, not arbitrary Chinese segmentation, machine translation, pronunciation audio, or a comprehensive Chinese course. Unknown record text has no generated reading/translation.

## Verification

13 automated tests cover all translation entries, title-only language policy (H1/H2/H3 versus body/buttons/labels/options), absence of preference reads/selector, contextual vocabulary and existing model/data/sample-export regressions. Syntax and sample export checks pass.

Local browser at 320px, 390px and desktop: zero supporting-language stacks outside headings; no nested/duplicated title stacks; no horizontal overflow. Forms/options and supporting text are English-only, and long form content fits the dialog. Removed the three-language option previews, duplicated body lines and expanded multilingual navigation spacing. The illustrated current/next widgets retain their prominence and CI.

Verified Chinese title tap, Enter, Escape, focus return, close/reopen and outside dismissal. Created a sample record `QA title-only วันนี้ 学校` / `เรียน 保存 unchanged`; saved text remained verbatim after reload. Completion, day/teaching views, exam filtering, project status, edit/delete passed. Test records were removed via UI and never committed. No console errors/warnings.

Entry script/styles/font CSS and changed module dependencies use a release version to avoid old cached language presentation. Previously open pages may need a normal reload for updated HTML.
