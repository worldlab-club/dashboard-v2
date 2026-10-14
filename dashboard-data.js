// Public educational baseline, explicitly approved by the parent on 2026-10-14.
// Source: explicit parent confirmation supplied in the task conversation, 2026-10-14.
export const profile = {
  id: "worldlab-confirmed-public-r1",
  real: true,
  label: "ข้อมูลที่ยืนยันแล้ว · เปิดสาธารณะ",
  term: {
    school: "SSIS",
    level: "Primary 1",
    academicYear: "2026–27",
    term: "Term 2",
    start: "2026-10-05",
    end: "2027-01-22",
    source: "ผู้ปกครองยืนยันในบทสนทนา วันที่ 14 ต.ค. 2026",
    scope:
      "ยืนยันเฉพาะระดับชั้นและช่วงเทอม ไม่ยืนยันรายวิชา เวลาเรียน การลงทะเบียนรายคอร์ส หรือวันสอบ",
  },
  pending:
    "รอยืนยัน: เวลาเรียน–สอน · รายวิชา/คอร์ส · วันหยุด/วันสอบ · โปรเจคและความสนใจปัจจุบัน",
};
const parentSource = {
  source: profile.term.source,
  checkedOn: "2026-10-14",
  scope: "ช่วงเทอมเท่านั้น ไม่ใช่เวลาเรียนรายวัน",
};
const appSource = {
  source: "เว็บไซต์แอป World Lab ที่มีอยู่จริง",
  checkedOn: "2026-10-14",
  scope:
    "ยืนยันแหล่งเรียนรู้ ไม่ยืนยันว่าเป็นความสนใจหรือคอร์สที่ลงทะเบียนของเด็ก",
};
export function initialData() {
  return structuredClone({
    version: 1,
    schedule: [],
    events: [
      {
        id: "term2-start-2026",
        title: "เริ่ม Term 2 · SSIS Primary 1",
        date: "2026-10-05",
        kind: "important",
        note: "ปีการศึกษา 2026–27 · ไม่มีเวลาเรียนหรือรายวิชาที่ได้รับการยืนยัน",
        sample: false,
        provenance: parentSource,
      },
      {
        id: "term2-end-2027",
        title: "สิ้นสุด Term 2 · SSIS Primary 1",
        date: "2027-01-22",
        kind: "important",
        note: "ยืนยันวันสิ้นสุดเทอมเท่านั้น ไม่ใช่วันสอบหรือวันหยุด",
        sample: false,
        provenance: parentSource,
      },
    ],
    projects: [],
    interests: [
      {
        id: "worldlab-map",
        title: "สำรวจแผนที่โลก",
        icon: "globe",
        note: "แอป World Lab ที่มีอยู่จริง · ยังไม่ยืนยันความสนใจปัจจุบัน",
        url: "https://worldlab-club.github.io/world-map/",
        sample: false,
        provenance: appSource,
      },
      {
        id: "worldlab-multiplication",
        title: "เล่นกับสูตรคูณ",
        icon: "math",
        note: "แอป World Lab ที่มีอยู่จริง · ยังไม่ยืนยันคอร์สหรือระดับการเรียน",
        url: "https://worldlab-club.github.io/multiplication-table/",
        sample: false,
        provenance: appSource,
      },
      {
        id: "worldlab-abacus",
        title: "ลองใช้ลูกคิด",
        icon: "math",
        note: "แอป World Lab ที่มีอยู่จริง · ยังไม่ยืนยันการลงทะเบียนหรือความคืบหน้า",
        url: "https://worldlab-club.github.io/abacus/",
        sample: false,
        provenance: appSource,
      },
    ],
    completed: {},
  });
}
