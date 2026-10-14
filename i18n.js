import { labels } from './translations.js';
import { vocabulary, findWord } from './vocabulary.js';
export const LANGUAGE_KEY = 'worldlab-ui-language-v1';
export const languages = ['th', 'en', 'zh-Hans'];
export function readLanguage(storage) {
  try { const value = storage.getItem(LANGUAGE_KEY); return languages.includes(value) ? value : 'th'; }
  catch { return 'th'; }
}
let language = typeof localStorage === 'undefined' ? 'th' : readLanguage(localStorage);
export const getLanguage = () => language;
export const locale = () => ({th:'th-TH',en:'en-GB','zh-Hans':'zh-CN'})[language];
const keys = Object.keys(labels).sort((a,b) => b.length-a.length);
const pattern = new RegExp('(?<![ก-๙A-Za-z])(?:'+keys.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![ก-๙A-Za-z])','g');
export function translate(source, lang = language) {
  if (lang === 'th') return source;
  return source.replace(/\s+/g, ' ').replace(pattern, key => labels[key][lang]);
}
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sources = new WeakMap();
// Keep a source and last applied value per node. Renders can replace nodes freely.
function apply(node, key, source, setter) {
  let entry = sources.get(node) || {};
  if (!entry[key] || entry[key].result !== source) entry[key] = {source};
  const result = translate(entry[key].source);
  entry[key].result = result;
  sources.set(node,entry);
  if (source !== result) setter(result);
}
let observer, opener;
const excluded = 'script,style,textarea,input,[data-original],#word-dialog,#vocabulary,.language-tools,#language-note';
function localize() {
  observer?.disconnect();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node=walker.nextNode())) {
    if (node.parentElement.closest(excluded) || !node.textContent.trim()) continue;
    apply(node,'text',node.textContent,value=>node.textContent=value);
  }
  document.querySelectorAll('[aria-label],[title]').forEach(el=>{
    if(el.closest(excluded)||el.hasAttribute('data-record-label')) return;
    for(const attr of ['aria-label','title']) if(el.hasAttribute(attr)) apply(el,attr,el.getAttribute(attr),v=>el.setAttribute(attr,v));
  });
  // Inline reading help only in non-action headings. Actions keep their original tap target.
  document.querySelectorAll('h1,h2,h3').forEach(heading=>{
    const existing=heading.querySelector('.word-help');
    if(language!=='zh-Hans'||heading.closest('[data-original],dialog')||heading.querySelector('[data-original]')) { existing?.remove(); return; }
    const text=heading.textContent;
    const words=vocabulary.filter(w=>text.includes(w.simplified));
    if(existing?.dataset.word===words[0]?.simplified) return;
    existing?.remove();
    if(words.length) {
      const b=document.createElement('button'); b.type='button'; b.className='word-help';
      b.dataset.word=words[0].simplified; b.textContent='📖';
      b.setAttribute('aria-label',`学习词语：${words[0].simplified} / Learn word`); heading.append(b);
    }
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}
function wordContent(word) {
  return `<p class="eyebrow">词语先行 · WORD FIRST · ความหมายทั้งคำ</p><h2 id="word-title" lang="zh-Hans">${word.simplified}</h2><p class="traditional" lang="zh-Hant">${word.traditional}</p><p class="pinyin" lang="zh-Latn-pinyin">${word.pinyin}</p><p class="word-meaning"><span lang="th">${word.thai}</span><br><span lang="en">${word.english}</span></p><p class="quiet">简体 / 繁體 · Simplified / Traditional · จีนตัวย่อ / ตัวเต็ม</p><h3>逐字参考 · Characters · รายตัวอักษร</h3><p class="quiet">Readings below are for this word. Character glosses do not add up to its whole meaning.<br><span lang="th">เสียงอ่านใช้ตามบริบทของคำนี้ ความหมายรายตัวไม่ใช่คำแปลทั้งคำ</span></p><div class="character-grid">${word.characters.map(c=>`<article><b><span lang="zh-Hans">${c.simplified}</span> / <span lang="zh-Hant">${c.traditional}</span></b><span class="pinyin" lang="zh-Latn-pinyin">${c.pinyin}</span><span lang="th">${c.thai}</span><span lang="en">${c.english}</span></article>`).join('')}</div>${word.note?`<p class="reading-note" lang="en">⚑ ${escapeHTML(word.note)}</p>`:''}<p class="quiet">Curated contextual vocabulary · CC-CEDICT / MDBG. Not automatic translation.<br><span lang="th">คำศัพท์คัดสรรตามบริบท ไม่ใช่ระบบแปลอัตโนมัติ</span></p>`;
}
function closeWord() { const d=document.querySelector('#word-dialog'); d.close(); }
function openWord(word, trigger) {
  const entry=findWord(word); if(!entry)return;
  opener=trigger;
  document.querySelector('#word-content').innerHTML=wordContent(entry);
  document.querySelector('#word-dialog').showModal();
  document.querySelector('#word-close').focus();
}
export function initLanguages(onChange) {
  const picker=document.querySelector('#language');
  picker.value=language;
  const note=document.querySelector('#language-note');
  const hints={th:'แปลเฉพาะป้ายและเมนู ข้อมูลที่กรอกและแหล่งอ้างอิงคงภาษาเดิม · เลือก中文เพื่อเรียนคำศัพท์',en:'Only interface labels are translated. Records and source notes stay in their original language. Choose 中文 for vocabulary.', 'zh-Hans':'仅翻译界面标签。个人记录与来源说明保留原文。📖 按钮用于学习词语，不会执行旁边的操作。'};
  function update() {
    document.documentElement.lang=language;
    note.textContent=hints[language];
    document.querySelector('#vocabulary').hidden=language!=='zh-Hans';
    document.querySelector('#word-list').innerHTML=vocabulary.map(w=>`<button type="button" data-word="${w.simplified}" aria-label="学习词语：${w.simplified}">${w.simplified}<span aria-hidden="true"> 📖</span></button>`).join('');
    localize();
  }
  observer=new MutationObserver(localize);
  picker.addEventListener('change',()=>{
    language=languages.includes(picker.value)?picker.value:'th';
    try{localStorage.setItem(LANGUAGE_KEY,language);}catch{ /* UI still works without storage. */ }
    document.querySelector('#word-dialog').close();
    onChange(); update();
  });
  document.addEventListener('click',e=>{const b=e.target.closest('[data-word]');if(b)openWord(b.dataset.word,b);});
  const dialog=document.querySelector('#word-dialog');
  document.querySelector('#word-close').onclick=closeWord;
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWord();}});
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});
  update();
}
