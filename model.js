export const DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
export const STATUS = {
  idea: "💡 ไอเดีย",
  doing: "🛠️ กำลังทำ",
  done: "🎉 สำเร็จแล้ว",
};
export const KINDS = {
  holiday: "🌴 วันหยุด",
  important: "⭐ วันสำคัญ",
  exam: "✏️ วันสอบ",
};
export const ICONS = {
  book: "📖 อ่าน",
  math: "🧮 คณิต",
  science: "🔬 วิทย์",
  art: "🎨 ศิลปะ",
  plant: "🌱 ต้นไม้",
  rocket: "🚀 อวกาศ",
  robot: "🤖 หุ่นยนต์",
  music: "🎵 ดนตรี",
  break: "🍎 พัก",
};
export const KEY = "worldlab-dashboard-v2.1";
export function bangkok(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
    day: new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`).getUTCDay(),
    month: `${p.year}-${p.month}`,
  };
}
export function seed(today = bangkok().date) {
  const month = today.slice(0, 7);
  return {
    version: 1,
    schedule: [
      {
        id: "s1",
        title: "อ่านเรื่องสนุก",
        icon: "book",
        day: 1,
        start: "09:00",
        end: "09:40",
        type: "class",
        note: "ฝึกอ่านและเล่าเรื่อง",
        sample: true,
      },
      {
        id: "s2",
        title: "เล่นกับตัวเลข",
        icon: "math",
        day: 1,
        start: "10:00",
        end: "10:40",
        type: "class",
        note: "นับ วัด และแก้ปริศนา",
        sample: true,
      },
      {
        id: "s3",
        title: "พักเติมพลัง",
        icon: "break",
        day: 1,
        start: "10:40",
        end: "11:00",
        type: "day",
        note: "ขยับตัวและกินของว่าง",
        sample: true,
      },
      {
        id: "s4",
        title: "ทดลองวิทย์",
        icon: "science",
        day: 2,
        start: "09:00",
        end: "09:45",
        type: "class",
        note: "ตั้งคำถามแล้วลองหาคำตอบ",
        sample: true,
      },
      {
        id: "s5",
        title: "วาดโลกในฝัน",
        icon: "art",
        day: 3,
        start: "09:00",
        end: "10:00",
        type: "class",
        note: "สี รูปทรง และจินตนาการ",
        sample: true,
      },
      {
        id: "s6",
        title: "สำรวจต้นไม้",
        icon: "plant",
        day: 3,
        start: "10:15",
        end: "11:00",
        type: "class",
        note: "สังเกตใบไม้และจดบันทึก",
        sample: true,
      },
      {
        id: "s7",
        title: "เล่นกับตัวเลข",
        icon: "math",
        day: 4,
        start: "09:00",
        end: "09:45",
        type: "class",
        note: "เกมคณิตศาสตร์",
        sample: true,
      },
      {
        id: "s8",
        title: "สนุกกับดนตรี",
        icon: "music",
        day: 5,
        start: "09:00",
        end: "09:45",
        type: "class",
        note: "ฟังจังหวะและเล่นดนตรี",
        sample: true,
      },
      {
        id: "s9",
        title: "เตรียมสอนวิทย์",
        icon: "science",
        day: 2,
        start: "08:30",
        end: "09:00",
        type: "teach",
        note: "ผู้สอน: เตรียมอุปกรณ์ทดลอง",
        sample: true,
      },
      {
        id: "s10",
        title: "เตรียมสอนศิลปะ",
        icon: "art",
        day: 3,
        start: "08:30",
        end: "09:00",
        type: "teach",
        note: "ผู้สอน: เตรียมสีและกระดาษ",
        sample: true,
      },
    ],
    events: [
      {
        id: "e1",
        title: "วันพักผ่อน (ตัวอย่าง)",
        date: month + "-10",
        kind: "holiday",
        note: "วันสมมติ ไม่ใช่วันหยุดจริง",
        sample: true,
      },
      {
        id: "e2",
        title: "วันแบ่งปันผลงาน (ตัวอย่าง)",
        date: month + "-18",
        kind: "important",
        note: "วันสมมติ รอยืนยันจากโรงเรียน",
        sample: true,
      },
      {
        id: "e3",
        title: "ทบทวนความรู้ (ตัวอย่าง)",
        date: month + "-23",
        kind: "exam",
        note: "วันสอบสมมติ รอยืนยันจากโรงเรียน",
        sample: true,
      },
    ],
    projects: [
      {
        id: "p1",
        title: "สวนจิ๋วของเรา",
        icon: "plant",
        note: "ลองเพาะถั่วแล้ววาดสิ่งที่เห็น",
        status: "doing",
        progress: 40,
        update: "เพาะเมล็ดแล้ว รอดูใบแรก · ตัวอย่าง",
        sample: true,
      },
      {
        id: "p2",
        title: "จรวดกระดาษ",
        icon: "rocket",
        note: "พับ ทดสอบ แล้วลองบินให้ไกลขึ้น",
        status: "idea",
        progress: 0,
        update: "กำลังวาดแบบจรวด · ตัวอย่าง",
        sample: true,
      },
      {
        id: "p3",
        title: "เพื่อนหุ่นยนต์",
        icon: "robot",
        note: "สร้างเพื่อนใหม่จากกล่องกระดาษ",
        status: "done",
        progress: 100,
        update: "ประกอบหุ่นยนต์สำเร็จแล้ว · ตัวอย่าง",
        sample: true,
      },
    ],
    interests: [
      {
        id: "i1",
        title: "ข้างบนมีอะไร?",
        icon: "rocket",
        note: "ดาวเคราะห์ ดวงจันทร์ และจักรวาล",
        url: "",
        sample: true,
      },
      {
        id: "i2",
        title: "ต้นไม้โตได้อย่างไร?",
        icon: "plant",
        note: "เรียนรู้ธรรมชาติรอบตัวเรา",
        url: "",
        sample: true,
      },
      {
        id: "i3",
        title: "หุ่นยนต์คิดได้ไหม?",
        icon: "robot",
        note: "เริ่มสำรวจโลกของเทคโนโลยี",
        url: "",
        sample: true,
      },
    ],
    completed: {},
  };
}
export function safeUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function validDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T12:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === v;
}
export function validate(category, r) {
  if (!r.title?.trim() || r.title.length > 90)
    throw Error("ใส่ชื่อ 1–90 ตัวอักษร");
  if ((r.note || "").length > 500)
    throw Error("รายละเอียดต้องไม่เกิน 500 ตัวอักษร");
  if (category === "schedule") {
    if (
      !Number.isInteger(r.day) ||
      r.day < 0 ||
      r.day > 6 ||
      !["day", "class", "teach"].includes(r.type)
    )
      throw Error("เลือกวันและประเภทให้ถูกต้อง");
    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(r.start) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(r.end) ||
      r.end <= r.start
    )
      throw Error("เวลาจบต้องอยู่หลังเวลาเริ่มในวันเดียวกัน");
  }
  if (category === "events" && (!validDate(r.date) || !KINDS[r.kind]))
    throw Error("เลือกวันที่และประเภทให้ถูกต้อง");
  if (category !== "events" && !ICONS[r.icon]) throw Error("เลือกรูปภาพ");
  if (
    category === "projects" &&
    (!STATUS[r.status] ||
      !Number.isFinite(r.progress) ||
      r.progress < 0 ||
      r.progress > 100 ||
      (r.update || "").length > 500)
  )
    throw Error("สถานะหรือความคืบหน้าไม่ถูกต้อง");
  if (category === "interests" && r.url && !safeUrl(r.url))
    throw Error("ใช้ลิงก์ https:// ที่ถูกต้องเท่านั้น");
  return r;
}
export function validateData(d) {
  if (
    d?.version !== 1 ||
    !d.completed ||
    typeof d.completed !== "object" ||
    Array.isArray(d.completed)
  )
    throw Error("Invalid saved data");
  for (const c of ["schedule", "events", "projects", "interests"]) {
    if (!Array.isArray(d[c]) || d[c].length > 300)
      throw Error("Invalid records");
    const ids = new Set();
    for (const r of d[c]) {
      if (
        typeof r.id !== "string" ||
        !r.id ||
        ids.has(r.id) ||
        r.id.length > 80
      )
        throw Error("Invalid ID");
      ids.add(r.id);
      validate(c, r);
    }
  }
  return d;
}
export function lessons(data, day, view = "day") {
  return data.schedule
    .filter(
      (r) =>
        r.day === day &&
        (view === "day" ? r.type !== "teach" : r.type === view),
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}
export function focus(data, time, day) {
  const list = lessons(data, day);
  const now = list.find((r) => r.start <= time && r.end > time) || null;
  const next = list.find((r) => r.start > time) || null;
  return { now, next };
}
export function monthCells(month) {
  const [y, m] = month.split("-").map(Number);
  return {
    offset: new Date(Date.UTC(y, m - 1, 1)).getUTCDay(),
    count: new Date(Date.UTC(y, m, 0)).getUTCDate(),
  };
}
export function eventList(data, month, kind = "all", date = null) {
  return data.events
    .filter(
      (e) =>
        e.date.startsWith(month) &&
        (kind === "all" || e.kind === kind) &&
        (!date || e.date === date),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}
