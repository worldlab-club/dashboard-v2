// Original inline SVG illustrations. No remote assets, fonts, or tracking requests.
const drawing = {
  plant:
    '<path d="M66 104h48l-9 39H75z" fill="#cc784c"/><path d="M90 104V48"/><path d="M90 80C52 84 49 48 58 47c29-1 35 16 32 33" fill="#76a96b"/><path d="M91 66c-2-32 24-43 35-36 6 23-11 43-35 36" fill="#98bc7d"/><path d="m68 63 22 17m22-35-21 21"/>',
  rocket:
    '<path d="m75 117 15 28 16-28" fill="#f5b731"/><path d="M73 98 51 118V89l24-21m30 30 24 20V89l-23-21" fill="#e4805a"/><path d="M70 107V66c0-26 20-44 20-44s20 18 20 44v41z" fill="#fff9ea"/><circle cx="90" cy="69" r="13" fill="#86b5c5"/><path d="M79 36h22"/><path d="m31 43 3-6m103 12 5 3M47 68h-7m87 61 4 5"/>',
  robot:
    '<path d="M89 36V23"/><circle cx="89" cy="20" r="5" fill="#e88c5c"/><rect x="57" y="39" width="65" height="50" rx="13" fill="#91acb1"/><rect x="66" y="94" width="47" height="36" rx="6" fill="#d2a669"/><path d="M73 131v13m32-13v13M61 102l-17 18m73-17 17 16"/><circle cx="76" cy="61" r="5" fill="#29453e"/><circle cx="103" cy="61" r="5" fill="#29453e"/><path d="M80 76h17"/><circle cx="90" cy="111" r="5" fill="#d06e43"/>',
  book: '<path d="M90 48c-20-13-44-11-55-6v81c21-7 37-4 55 7 18-11 36-14 56-7V42c-17-6-36-5-56 6" fill="#fff8df"/><path d="M90 48v82M48 60l27 3m-27 14 27 3m-27 14 27 3m31-32 25-5m-25 20 25-5m-25 20 25-5"/><path d="M112 32v35l7-5 7 2V32" fill="#df7f5a"/>',
  math: '<rect x="47" y="27" width="87" height="119" rx="12" fill="#91b3a0"/><rect x="58" y="40" width="64" height="29" rx="4" fill="#fdf7da"/><path d="m72 52 5 5-5 5m14 0h15"/><g fill="#fff4d5"><circle cx="66" cy="87" r="7"/><circle cx="91" cy="87" r="7"/><circle cx="116" cy="87" r="7"/><circle cx="66" cy="112" r="7"/><circle cx="91" cy="112" r="7"/></g><circle cx="116" cy="112" r="7" fill="#e89060"/>',
  science:
    '<path d="M75 25h30m-25 0v42l-36 58q-7 16 10 17h75q17-1 8-17l-37-58V25" fill="#f9f5dd"/><path d="m64 97-18 30q-3 10 8 10h75q10 0 7-10l-19-30z" fill="#91bab2"/><circle cx="88" cy="112" r="6" fill="#f9f3d8"/><circle cx="105" cy="126" r="4" fill="#f9f3d8"/><path d="m40 48 4-9m-9 5h10m87 20h11m-5-5v11"/>',
  art: '<path d="M91 33c-37 0-63 27-63 55s26 47 50 47c13 0 11-17 22-19 11-2 21 12 36-3 32-33-5-80-45-80" fill="#e1b97c"/><circle cx="53" cy="80" r="10" fill="#e27d58"/><circle cx="75" cy="53" r="9" fill="#86ab70"/><circle cx="107" cy="56" r="9" fill="#7c9cad"/><circle cx="126" cy="83" r="8" fill="#eed56b"/><path d="m78 138 51-78 7 4-49 82" fill="#91a599"/>',
  music:
    '<path d="M79 116V45l53-13v71"/><path d="m80 62 51-13"/><ellipse cx="63" cy="121" rx="16" ry="12" fill="#df9669"/><ellipse cx="116" cy="107" rx="16" ry="12" fill="#df9669"/><path d="M40 60v23m-8-15h17m98 60 4 6"/>',
  break:
    '<path d="M88 61c-33-29-63 6-45 43s38 32 46 27c16 13 43-4 51-37 10-34-27-50-52-33" fill="#dc8e6b"/><path d="M89 60V39c14-16 31-11 34-4-2 16-17 19-34 16" fill="#8fb17b"/><path d="M62 74q-14 11-4 26" stroke="#ffdfac"/>',
  rest: '<path d="M34 114q55-53 112 0" fill="#b8c999"/><circle cx="92" cy="57" r="26" fill="#f2c65c"/><path d="m92 18 0-9m37 22 8-7m-76 7-8-7m-8 34h-9m112 0h-10M51 141h79"/>',
};
export function art(icon) {
  return `<svg class="art" viewBox="0 0 180 165" fill="none" stroke="#34554a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="90" cy="149" rx="52" ry="5" fill="#34554a" opacity=".08" stroke="none"/>${drawing[icon] || drawing.rest}</svg>`;
}
