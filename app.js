import { initLanguages, locale, translate } from "./i18n.js?v=titles-1";
import {
  DAYS,
  STATUS,
  KINDS,
  ICONS,
  KEY,
  bangkok,
  safeUrl,
  validate,
  validateData,
  lessons,
  focus,
  monthCells,
  eventList,
} from "./model.js";
import { art } from "./art.js";
import { profile, initialData } from "./data-profile.js";
const storageKey = `${KEY}-${profile.id}`;
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
let data = initialData(),
  storageOK = true,
  loadWarning = false;
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) data = validateData(JSON.parse(raw));
} catch {
  storageOK = false;
  loadWarning = true;
}
let today = bangkok(),
  day = today.day,
  view = "day",
  month = today.month,
  kind = "all",
  selectedDate = null,
  editing = null,
  detailId = null;
const original = (value) => `<span data-original>${esc(value)}</span>`;
const colors = ["", "blue", "peach"];
function storageLabel() {
  $("#storage-status").textContent = storageOK
    ? "🔒 ข้อมูลแก้ไขเก็บในเบราว์เซอร์นี้เท่านั้น ไม่ซิงค์ GitHub · ไม่มีการติดตาม"
    : "⚠ บันทึกถาวรไม่ได้ / ข้อมูลเดิมอ่านไม่ได้ · การแก้ไขอาจหายเมื่อปิดหน้านี้";
}
function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageOK = true;
    storageLabel();
    return true;
  } catch {
    storageOK = false;
    storageLabel();
    return false;
  }
}
let toastTimer;
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").style.display = "none"), 4000);
}
function saved() {
  toast(
    save()
      ? "บันทึกในเบราว์เซอร์นี้แล้ว ✓"
      : "บันทึกไม่ได้ — ใช้ชั่วคราวในหน้านี้",
  );
}
function dateLabel(date, opts = { day: "numeric", month: "short" }) {
  return new Date(date + "T12:00:00Z").toLocaleDateString(locale(), opts);
}
function provenance(r) {
  return r.provenance
    ? `<details class="source-details"><summary>ที่มา / สิ่งที่ยังไม่ยืนยัน</summary><small class="provenance">${original(r.provenance.source)} · ตรวจ ${esc(r.provenance.checkedOn)}<br>${original(r.provenance.scope)}</small></details>`
    : "";
}
function renderFocus() {
  const f = focus(data, today.time, today.day);
  $("#focus").innerHTML = [
    ["now", f.now],
    ["next", f.next],
  ]
    .map(
      ([type, r]) =>
        `<article class="focus-card ${type === "next" ? "next" : ""}"><div><p class="eyebrow">${type === "now" ? "● ตอนนี้ · NOW" : "↗ ต่อไป · UP NEXT"}</p><span class="pill">${r ? (r.sample ? "ตารางตัวอย่าง" : "ตารางของเรา") : profile.real ? "รอยืนยันตาราง" : "พักได้เลย"}</span><h2>${r ? original(r.title) : (type === "now" ? "เวลาของเรา" : "ค่อย ๆ ค้นพบ")}</h2><p>${r ? (r.note ? original(r.note) : "พร้อมแล้ว ลองกันเลย") : (profile.real ? "ยังไม่มีเวลาเรียน–สอนที่ยืนยัน ไม่ได้หมายความว่าเป็นเวลาว่าง" : type === "now" ? "ไม่มีรายการในช่วงเวลานี้" : "ยังไม่มีกิจกรรมถัดไปวันนี้")}</p>${r ? `<span class="focus-time">${r.start} — ${r.end}</span>` : ""}</div>${art(r?.icon || "rest")}</article>`,
    )
    .join("");
}
function renderSchedule() {
  document
    .querySelectorAll("[data-view]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.view === view)),
    );
  $("#day-picker").innerHTML = DAYS.map(
    (d, i) =>
      `<button data-day="${i}" aria-pressed="${day === i}" aria-label="${["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"][i]}">${d}</button>`,
  ).join("");
  const records = lessons(data, day, view);
  $("#timeline").innerHTML =
    records
      .map((r) => {
        const done = !!data.completed[`${today.date}:${r.id}`];
        return `<article class="lesson"><time>${r.start}<small>${r.end}</small></time>${art(r.icon)}<div><h3>${original(r.title)}</h3><p>${original(r.note)}${r.sample ? " · ตัวอย่าง" : ""}</p></div>${day === today.day ? `<button class="done" data-record-label data-done="${esc(r.id)}" aria-pressed="${done}" aria-label="${translate(done ? "ยกเลิกเสร็จแล้ว" : "ทำเสร็จแล้ว")}: ${esc(r.title)}">${done ? "✓" : "○"}</button>` : '<span aria-hidden="true">·</span>'}</article>`;
      })
      .join("") ||
    (profile.real
      ? '<p class="empty">🗓️ รอยืนยันเวลาเรียน–สอน<br>ยังไม่มีตารางรายวัน จึงไม่แสดงเวลาโดยคาดเดา</p>'
      : '<p class="empty">🌿 ยังไม่มีรายการวันนี้<br>ผู้ปกครองเพิ่มกิจกรรมได้</p>');
  $("#schedule-caption").textContent =
    view === "teach"
      ? profile.real
        ? "มุมมองผู้สอน · ยังไม่ยืนยันรายวิชา/คอร์สและเวลา"
        : "มุมมองผู้สอน · ตารางประจำสัปดาห์ตัวอย่าง"
      : `ตารางประจำสัปดาห์ · ${day === today.day ? "ทำเครื่องหมายเมื่อเสร็จได้" : "เลือกวันวันนี้เพื่อทำเครื่องหมายเสร็จ"} · เวลาไทย`;
}
function renderCalendar() {
  const { offset, count } = monthCells(month);
  $("#month-label").textContent = dateLabel(month + "-01", {
    month: "long",
    year: "numeric",
  });
  $("#month-grid").innerHTML =
    DAYS.map((d) => `<span class="weekday">${d}</span>`).join("") +
    "<span></span>".repeat(offset) +
    Array.from({ length: count }, (_, i) => {
      const date = `${month}-${String(i + 1).padStart(2, "0")}`;
      const events = eventList(data, month, kind, date);
      return `<button data-record-label class="date ${date === today.date ? "today" : ""} ${date === selectedDate ? "selected" : ""}" data-date="${date}" aria-pressed="${date === selectedDate}" ${date === today.date ? 'aria-current="date"' : ""} aria-label="${dateLabel(date, { day: "numeric", month: "long", year: "numeric" })}${events.length ? " · " + events.map((e) => translate(KINDS[e.kind]) + " " + esc(e.title)).join(", ") : ""}">${i + 1}<span class="dots">${[...new Set(events.map((e) => e.kind))].map((k) => `<i class="dot ${k}"></i>`).join("")}</span></button>`;
    }).join("");
  document
    .querySelectorAll("[data-kind]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.kind === kind)),
    );
  const items = eventList(data, month, kind, selectedDate);
  $("#events").innerHTML =
    (selectedDate
      ? `<p class="quiet">${dateLabel(selectedDate, { day: "numeric", month: "long" })}</p>`
      : "") +
    (items
      .map(
        (e) =>
          `<article class="event"><span class="event-icon" aria-hidden="true">${KINDS[e.kind].split(" ")[0]}</span><div><b>${original(e.title)}</b><small>${dateLabel(e.date)} · ${KINDS[e.kind]}${e.sample ? " · ตัวอย่าง" : ""}</small><small>${original(e.note)}</small>${provenance(e)}</div></article>`,
      )
      .join("") || '<p class="empty">ไม่มีรายการในช่วงที่เลือก</p>');
  $("#all-events").hidden = !selectedDate;
}
function renderCards() {
  $("#project-grid").innerHTML =
    data.projects
      .map(
        (p, i) =>
          `<button class="project-card" data-record-label data-project="${esc(p.id)}" aria-label="${translate("ดูโปรเจค")} ${esc(p.title)}"><div class="picture ${colors[i % 3]}"><span class="number">PROJECT / ${String(i + 1).padStart(2, "0")}</span>${art(p.icon)}</div><div class="card-body"><span class="status">${STATUS[p.status]}</span><h3>${original(p.title)}</h3><p>${original(p.update || p.note)}</p><div class="progress-label"><span>${p.sample ? "ความคืบหน้าตัวอย่าง" : "ความคืบหน้า"}</span><b>${p.progress}%</b></div><progress class="progress" data-record-label aria-label="${translate("ความคืบหน้า")} ${esc(p.title)}" value="${p.progress}" max="100">${p.progress}%</progress></div></button>`,
      )
      .join("") ||
    '<p class="empty">🛠️ รอยืนยันโปรเจคงานอดิเรกและสถานะจริง<br>ยังไม่ใส่ชื่อโปรเจคหรือเปอร์เซ็นต์ความคืบหน้าโดยคาดเดา</p>';
  $("#interest-grid").innerHTML =
    data.interests
      .map((p, i) => {
        const url = safeUrl(p.url);
        return `<article class="interest-card"><div class="picture ${["blue", "yellow", "yellow"][i % 3]}"><span class="number">CURIOUS / ${String(i + 1).padStart(2, "0")}</span>${art(p.icon)}</div><div class="card-body"><h3>${original(p.title)}</h3><p>${original(p.note)}${p.sample ? " · ตัวอย่าง" : ""}</p>${provenance(p)}${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">▶ เปิดลิงก์เรียนรู้ ↗</a>` : '<span class="disabled-link">▶ รอผู้ปกครองเพิ่มลิงก์ YouTube</span>'}</div></article>`;
      })
      .join("") ||
    '<p class="empty">อยากรู้เรื่องอะไร? เพิ่มได้ในมุมผู้ปกครอง</p>';
}
function render() {
  const all = [
    ...data.schedule,
    ...data.events,
    ...data.projects,
    ...data.interests,
  ];
  const mixed = all.some((r) => !r.sample);
  $(".notice").innerHTML = profile.real
    ? "<span>🌍 <b>ข้อมูลที่ยืนยันแล้ว · เปิดสาธารณะ</b></span><span>ส่วนที่ยังไม่ยืนยันจะแสดงว่ารอข้อมูล</span>"
    : mixed
      ? "<span>🧪 <b>เดโมตัวอย่าง · มีข้อมูลที่แก้ไขบนเครื่องนี้</b></span><span>รายการตัวอย่างไม่ใช่ข้อมูลจริง</span>"
      : "<span>🧪 <b>โลกทดลอง · ข้อมูลตัวอย่างทั้งหมด</b></span><span>ยังไม่ใช่ตารางจริงของโรงเรียน</span>";
  $("#context").hidden = !profile.term;
  if (profile.term) {
    const t = profile.term;
    $("#context").innerHTML =
      `<div><p class="eyebrow">CONFIRMED TERM · ช่วงเทอมที่ยืนยันแล้ว</p><h2>${esc(t.school)} · ${esc(t.level)} · ${esc(t.term)}</h2><p>${dateLabel(t.start, { day: "numeric", month: "long", year: "numeric" })} — ${dateLabel(t.end, { day: "numeric", month: "long", year: "numeric" })} · AY ${esc(t.academicYear)}</p><details class="source-details"><summary>ที่มาและขอบเขตข้อมูล</summary><p class="quiet">${original(t.source)}<br>${original(t.scope)}</p></details><p class="pending">${original(profile.pending)}</p></div>`;
  }
  $("#schedule .section-head .sample").textContent = profile.real
    ? "รอเวลาเรียนจริง"
    : "ตัวอย่าง";
  $("#calendar .section-head .sample").textContent = profile.real
    ? "ช่วงเทอมยืนยันแล้ว"
    : "ตัวอย่าง";
  $("#projects .section-head .sample").textContent = profile.real
    ? "ยังไม่ยืนยันสถานะจริง"
    : "โปรเจคตัวอย่าง · กดเพื่อดู / อัปเดต";
  $("#interests .section-head .sample").textContent = profile.real
    ? "แอปจริง · ยังไม่ยืนยันความสนใจ"
    : "ความสนใจตัวอย่าง";
  $("#editor-disclosure").textContent = profile.real
    ? "ข้อมูลเริ่มต้นมีเฉพาะช่วงเทอมที่ผู้ปกครองยืนยันและแอป World Lab ที่มีอยู่จริง · รายวิชา เวลา วันสอบ และสถานะส่วนตัวยังไม่ยืนยัน"
    : "เริ่มจากข้อมูลตัวอย่างทั้งหมด · แก้ไขรายการได้เฉพาะบนเครื่องนี้";
  renderFocus();
  renderSchedule();
  renderCalendar();
  renderCards();
  storageLabel();
}
function tick() {
  const next = bangkok();
  const changed = next.date !== today.date;
  if (changed) {
    day = next.day;
    month = next.month;
    selectedDate = null;
  }
  const minute = next.time !== today.time;
  today = next;
  $("#clock").textContent = today.time;
  $("#today-label").textContent = dateLabel(today.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (changed) render();
  else if (minute) renderFocus();
}
$("#schedule-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-view]");
  if (b) {
    view = b.dataset.view;
    renderSchedule();
  }
});
$("#day-picker").addEventListener("click", (e) => {
  const b = e.target.closest("[data-day]");
  if (b) {
    day = Number(b.dataset.day);
    renderSchedule();
  }
});
$("#timeline").addEventListener("click", (e) => {
  const b = e.target.closest("[data-done]");
  if (b) {
    const key = `${today.date}:${b.dataset.done}`;
    if (data.completed[key]) delete data.completed[key];
    else data.completed[key] = true;
    const cutoff = new Date(Date.now() - 31 * 864e5).toISOString().slice(0, 10);
    Object.keys(data.completed).forEach((k) => {
      if (k.slice(0, 10) < cutoff) delete data.completed[k];
    });
    saved();
    renderSchedule();
  }
});
function moveMonth(n) {
  const [y, m] = month.split("-").map(Number);
  month = new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
  selectedDate = null;
  renderCalendar();
}
$("#prev-month").onclick = () => moveMonth(-1);
$("#next-month").onclick = () => moveMonth(1);
$("#this-month").onclick = () => {
  month = today.month;
  selectedDate = null;
  renderCalendar();
};
$("#month-grid").onclick = (e) => {
  const b = e.target.closest("[data-date]");
  if (b) {
    selectedDate = selectedDate === b.dataset.date ? null : b.dataset.date;
    renderCalendar();
  }
};
$("#event-filters").onclick = (e) => {
  const b = e.target.closest("[data-kind]");
  if (b) {
    kind = b.dataset.kind;
    renderCalendar();
  }
};
$("#all-events").onclick = () => {
  selectedDate = null;
  renderCalendar();
};
function showProject(id) {
  const p = data.projects.find((p) => p.id === id);
  if (!p) return;
  detailId = id;
  $("#detail").innerHTML =
    `<div class="detail-art">${art(p.icon)}</div><p class="eyebrow">${p.sample ? "SAMPLE PROJECT · โปรเจคตัวอย่าง" : "MY PROJECT"}</p><h2 id="detail-title">${original(p.title)}</h2><p>${original(p.note)}</p><span class="status">${STATUS[p.status]}</span><p class="update-note">${original(p.update)}</p><div class="detail-actions" aria-label="เปลี่ยนสถานะ">${Object.entries(
      STATUS,
    )
      .map(
        ([v, t]) =>
          `<button data-status="${v}" aria-pressed="${p.status === v}">${t}</button>`,
      )
      .join(
        "",
      )}</div><p class="quiet">สถานะเปลี่ยนบนเครื่องนี้เท่านั้น · ผู้ปกครองแก้รายละเอียดและ % ได้</p>`;
}
$("#project-grid").onclick = (e) => {
  const b = e.target.closest("[data-project]");
  if (b) {
    showProject(b.dataset.project);
    $("#detail-dialog").showModal();
  }
};
$("#detail").onclick = (e) => {
  const b = e.target.closest("[data-status]");
  if (b) {
    const p = data.projects.find((p) => p.id === detailId);
    p.status = b.dataset.status;
    p.progress =
      p.status === "done"
        ? 100
        : p.status === "idea"
          ? 0
          : p.progress === 0 || p.progress === 100
            ? 50
            : p.progress;
    saved();
    showProject(detailId);
    renderCards();
  }
};
document
  .querySelectorAll("[data-close]")
  .forEach((b) => (b.onclick = () => b.closest("dialog").close()));
const category = () => $("#edit-category").value;
function listRecords() {
  editing = null;
  $("#record-form").hidden = true;
  $("#record-list").hidden = false;
  $("#record-list").innerHTML =
    data[category()]
      .map(
        (r) =>
          `<div class="record"><div><b>${original(r.title)}</b><small>${original(r.date || r.start || r.update || r.note)}${r.sample ? " · ตัวอย่าง" : ""}</small></div><button data-edit-id="${esc(r.id)}">แก้ไข</button></div>`,
      )
      .join("") || '<p class="empty">ยังไม่มีรายการ · เพิ่มรายการแรกได้เลย</p>';
}
$("#edit").onclick = () => {
  listRecords();
  $("#editor").showModal();
};
$("#edit-category").onchange = listRecords;
function field(name, label, value = "", type = "text", attrs = "") {
  return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
}
function select(name, label, options, value) {
  return `<label>${label}<select name="${name}">${Object.entries(options)
    .map(
      ([v, t]) =>
        `<option value="${v}" ${String(value) === v ? "selected" : ""}>${t}</option>`,
    )
    .join("")}</select></label>`;
}
function form(id = null) {
  const c = category();
  editing = id;
  const r = data[c].find((x) => x.id === id) || {
    title: "",
    icon: "book",
    day: today.day,
    start: "09:00",
    end: "10:00",
    type: "class",
    date: today.date,
    kind: "important",
    note: "",
    status: "idea",
    progress: 0,
    update: "",
    url: "",
    sample: false,
  };
  $("#record-list").hidden = true;
  const f = $("#record-form");
  f.hidden = false;
  f.innerHTML = `<h3>${id ? "แก้ไขรายการ" : "เพิ่มรายการ"}</h3>${field("title", "ชื่อ", r.title, "text", 'required maxlength="90"')}${c !== "events" ? select("icon", "รูปภาพ", ICONS, r.icon) : ""}<div class="form-grid">${c === "schedule" ? select("day", "วันประจำสัปดาห์", Object.fromEntries(DAYS.map((d, i) => [i, d])), r.day) + select("type", "ประเภท", { day: "กิจกรรมทั่วไป", class: "เรียน", teach: "สอน / เตรียมสอน" }, r.type) + field("start", "เริ่ม", r.start, "time", "required") + field("end", "สิ้นสุด", r.end, "time", "required") : ""}${c === "events" ? field("date", "วันที่", r.date, "date", "required") + select("kind", "ประเภท", KINDS, r.kind) : ""}${c === "projects" ? select("status", "สถานะ", STATUS, r.status) + field("progress", "ความคืบหน้า (%)", r.progress, "number", 'min="0" max="100" required') : ""}</div><label>รายละเอียด<textarea data-original name="note" maxlength="500">${esc(r.note)}</textarea></label>${c === "projects" ? field("update", "อัปเดตล่าสุด", r.update, "text", 'maxlength="500"') : ""}${c === "interests" ? field("url", "ลิงก์ YouTube / แหล่งเรียนรู้ (https://) — เว้นว่างได้", r.url, "url") + '<p class="quiet">เลือกลิงก์ช่อง / วิดีโอทางการที่ตรวจแล้ว เหมาะกับเด็ก · เปิดเว็บภายนอกเมื่อกดเท่านั้น</p>' : ""}${select("sample", "ป้ายกำกับข้อมูล", { yes: "ข้อมูลตัวอย่าง", no: "ข้อมูลที่ผู้ปกครองใส่" }, r.sample ? "yes" : "no")}<p id="form-error" class="error" role="alert"></p><div class="form-actions"><button class="primary" type="submit">บันทึก</button><button type="button" id="cancel-form">ยกเลิก</button>${id ? '<button type="button" class="danger" id="delete-record">ลบรายการ</button>' : ""}</div>`;
  $("#cancel-form").onclick = listRecords;
  if (id)
    $("#delete-record").onclick = () => {
      if (!$("#delete-confirm")) {
        $("#delete-record").insertAdjacentHTML(
          "afterend",
          '<button type="button" class="danger" id="delete-confirm">ยืนยันลบรายการนี้</button>',
        );
        $("#delete-confirm").onclick = () => {
          data[c] = data[c].filter((r) => r.id !== id);
          saved();
          render();
          listRecords();
        };
      }
    };
  f.querySelector("input").focus();
}
$("#add-record").onclick = () => form();
$("#record-list").onclick = (e) => {
  const b = e.target.closest("[data-edit-id]");
  if (b) form(b.dataset.editId);
};
$("#record-form").onsubmit = (e) => {
  e.preventDefault();
  const c = category(),
    v = Object.fromEntries(new FormData(e.target)),
    old = data[c].find((r) => r.id === editing);
  const r = {
    id: editing || crypto.randomUUID(),
    title: v.title.trim(),
    note: v.note.trim(),
    sample: v.sample === "yes",
    provenance: {
      source: "ผู้ปกครองแก้ไขในเบราว์เซอร์นี้",
      checkedOn: today.date,
      scope: "ยังไม่ได้ตรวจแหล่งต้นฉบับหลังการแก้ไข",
    },
  };
  if (c !== "events") r.icon = v.icon;
  if (c === "schedule")
    Object.assign(r, {
      day: Number(v.day),
      start: v.start,
      end: v.end,
      type: v.type,
    });
  if (c === "events") Object.assign(r, { date: v.date, kind: v.kind });
  if (c === "projects")
    Object.assign(r, {
      status: v.status,
      progress: Number(v.progress),
      update: v.update.trim(),
    });
  if (c === "interests") r.url = v.url.trim();
  try {
    validate(c, r);
    if (data[c].length >= 300 && !old)
      throw Error("เพิ่มได้สูงสุด 300 รายการต่อหมวด");
    if (old) data[c][data[c].indexOf(old)] = r;
    else data[c].push(r);
    saved();
    render();
    listRecords();
  } catch (err) {
    $("#form-error").textContent = err.message;
  }
};
tick();
render();
initLanguages();
setInterval(tick, 15000);
if (loadWarning)
  toast(
    "อ่านข้อมูลเดิมไม่ได้ กำลังแสดงข้อมูลเริ่มต้นของโปรเจค — ตรวจพื้นที่จัดเก็บของเบราว์เซอร์",
  );
