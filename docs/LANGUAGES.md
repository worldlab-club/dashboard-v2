# Interface languages and Chinese learning

The header switches Thai, English and Simplified Chinese. Date labels use the selected locale; the clock remains Asia/Bangkok. `translations.js` contains the fixed interface label catalog, including parent editor fields, validation messages, notices, filters and accessibility labels. Brand names remain as in World Lab CI.

Personal records, baseline record titles/notes, term metadata and source evidence keep their original text. This is disclosed above the dashboard in all three languages. There is no automatic translation of unknown records, no external translation service, and no transmission of child data. Input/textarea values and `data-original` render boundaries are excluded from localization. Record-bearing accessibility labels translate the action prefix explicitly and retain the title. Fixed-label substitutions use word boundaries and longest matching phrases; original text nodes are tracked independently of their translated display.

Language preference uses `worldlab-ui-language-v1`, separate from the unchanged personal data key. It never resets records or completion/status data. Without browser storage, language changes work for the current page but cannot persist.

## Learning interaction

In Chinese mode, explicit 📖 buttons beside selected headings open word cards. The expandable vocabulary section has **42 curated contextual words** covering schedule/menu and activity vocabulary. These are learning buttons, separate from navigation/actions: clicking a calendar link, schedule filter or toolbox link still does that action immediately. No hover is required.

Each modal gives Simplified, Traditional, tone-marked pinyin, Thai and English whole-word meaning first, followed by every character with its in-word reading and short Thai/English gloss. Neutral tones have no tone mark. Characters are not presented as an additive translation algorithm. Examples include 学校 / 學校 / xuéxiào; 音乐 / 音樂 / yīnyuè; 教学 / 教學 / jiàoxué (noun). Cards flag contextual readings of 乐、长、假、重、兴、数、教 and simplified mergers 历→曆/歷 and 发→發/髮. International chess is 国际象棋, distinguished from 象棋 (Chinese chess).

Open with tap/click or Enter/Space. Native `dialog.showModal()` provides modal semantics and background inertness. Focus starts on Close and returns to the connected opener on dismissal. Close button, Escape and backdrop click dismiss it. Max viewport width/height and internal scrolling keep long cards usable at narrow sizes. No audio/autoplay or remote lookup occurs.

## Sources and editorial limits

- Readings, contextual word meanings and Traditional word forms checked on 2026-10-14 against [CC-CEDICT / MDBG](https://www.mdbg.net/chinese/dictionary?page=cedict), using its [official current UTF-8 export](https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz). The full dictionary is not bundled. Short teaching glosses, Thai meanings and UI translations are manually curated for this dashboard.
- Both script forms are explicit per word; there is no blanket character converter. Readings and glosses are contextual, not exhaustive dictionary entries. Mandarin standard readings are used, with neutral tones shown where appropriate; regional pronunciation and connected-speech tone changes are not exhaustive.
- Noto Sans CJK SC Regular from the official [Noto CJK repository](https://github.com/notofonts/noto-cjk/tree/main/Sans) is self-hosted and includes both Simplified and Traditional glyphs. Its SIL Open Font License is included. This full font is approximately 16 MiB, fetched from this site only when needed and browser-cacheable. Existing Thai/Latin brand typography stays intact.
- This is a curated 42-word learning set, not arbitrary Chinese segmentation, machine translation, pronunciation audio, or a comprehensive Chinese course. Unknown record text has no generated reading/translation.

## Verification

13 automated tests: existing model/data isolation/sample export checks, full fixed-label catalog in all languages, safe preference fallback and key separation, whole-word forms/readings and per-character coverage, polyphonic/merger examples. Syntax and sample build checks pass.

Local browser: repeated Thai→English→Chinese switches and reload persistence; created sample title `学校 วันนี้ QA sample` and note `เรียน ดนตรี 保存 — original record` remained verbatim; editor values round-tripped; sample record deleted through UI afterward. Calendar filtering, completion, project status/change, edit/delete passed. No console errors/warnings.

Modal: Enter open, Escape close, focus return, repeated close/reopen, outside tap, 320×740 and 390×844 mobile, 820×1180 tablet, desktop. No horizontal overflow; 320px dialog bounds stayed within viewport and long content scrolled internally. Native modal makes background inert. Test data was confined to local preview storage and never committed.
