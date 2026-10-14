import { labels } from './translations.js?v=stacked-1';
import { vocabulary, findWord } from './vocabulary.js';
// All languages are visible. The former preference key is deliberately never read.
export const locale = () => 'en-GB';
const keys = Object.keys(labels).sort((a,b) => b.length-a.length);
const pattern = new RegExp('(?<![ก-๙A-Za-z])(?:'+keys.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![ก-๙A-Za-z])','g');
export function translate(source, lang = 'en') {
  return source.replace(/\s+/g, ' ').replace(pattern, key => lang === 'th' ? (labels[key].th || key) : labels[key][lang]);
}
export const stackedParts = source => ({en:translate(source,'en'),th:translate(source,'th'),zh:translate(source,'zh-Hans')});
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sources = new WeakMap();
let observer, opener;
const excluded = 'script,style,textarea,input,[data-original],#word-dialog,#vocabulary,.ml-label,.ml-chinese,#language-note';
const wordPattern = new RegExp(vocabulary.map(w=>w.simplified).sort((a,b)=>b.length-a.length).join('|'),'g');
function chineseHTML(text, learn) {
  if(!learn) return escapeHTML(text);
  let out='',last=0;
  for(const match of text.matchAll(wordPattern)){
    out+=escapeHTML(text.slice(last,match.index));
    out+=`<button type="button" class="word-link" data-word="${match[0]}" aria-label="Learn word: ${match[0]} / เรียนคำศัพท์ / 学习词语">${match[0]}</button>`;
    last=match.index+match[0].length;
  }
  return out+escapeHTML(text.slice(last));
}
function localize() {
  observer?.disconnect();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT), nodes=[];
  let node;
  while((node=walker.nextNode())) if(node.textContent.trim()&&!node.parentElement.closest(excluded+',option[data-localized-option]')) nodes.push(node);
  for(const textNode of nodes){
    const source=textNode.textContent, parts=stackedParts(source);
    if(parts.en===parts.th && parts.th===parts.zh) continue;
    const parent=textNode.parentElement;
    // Native select options have a single text row; retain all three names inline.
    if(parent.tagName==='OPTION'){
      parent.dataset.originalOption=source;
      textNode.textContent=`${parts.en} · ${parts.th} · ${parts.zh}`;
      parent.dataset.localizedOption='true';
      continue;
    }
    const action=parent.closest('a,button,summary');
    const learnContext=parent.closest('h1,h2,h3,.jump,.segments,.legend,.toolbox,.lab-key,.header-right');
    const canLearn=!!learnContext && !parent.closest('[data-project],label,option');
    const label=document.createElement('span');label.className='ml-label';
    label.innerHTML=`<span class="ml-primary" lang="en">${escapeHTML(parts.en)}</span><span class="ml-secondary" lang="th">${escapeHTML(parts.th)}</span>`;
    const chinese=document.createElement('span'); chinese.className='ml-secondary ml-chinese';chinese.lang='zh-Hans';
    chinese.innerHTML=chineseHTML(parts.zh,canLearn);
    if(action && canLearn && chinese.querySelector('button')){
      let group=action.parentElement;
      if(!group.classList.contains('ml-action')){
        group=document.createElement('span');group.className='ml-action';
        action.replaceWith(group);group.append(action);
      }
      group.append(chinese);
    }else label.append(chinese);
    textNode.replaceWith(label);
  }
  document.querySelectorAll('[aria-label],[title]').forEach(el=>{
    if(el.closest(excluded)||el.hasAttribute('data-record-label')) return;
    for(const attr of ['aria-label','title']) if(el.hasAttribute(attr)){
      const current=el.getAttribute(attr);let entry=sources.get(el)||{};
      if(!entry[attr]||entry[attr].result!==current) entry[attr]={source:current};
      const p=stackedParts(entry[attr].source),result=[...new Set([p.en,p.th,p.zh])].join(' / ');
      entry[attr].result=result;sources.set(el,entry);if(current!==result)el.setAttribute(attr,result);
    }
  });
  document.querySelectorAll('select:not(#language)').forEach(select=>{
    const selected=select.selectedOptions[0];if(!selected?.dataset.originalOption)return;
    let preview=select.nextElementSibling;
    if(!preview?.classList.contains('option-preview')){preview=document.createElement('span');preview.className='option-preview ml-label';preview.setAttribute('aria-hidden','true');select.after(preview);}
    const p=stackedParts(selected.dataset.originalOption);
    preview.innerHTML=`<span class="ml-primary" lang="en">${escapeHTML(p.en)}</span><span class="ml-secondary" lang="th">${escapeHTML(p.th)}</span><span class="ml-secondary" lang="zh-Hans">${escapeHTML(p.zh)}</span>`;
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
export function initLanguages() {
  document.documentElement.lang='en';
  document.querySelector('#language-note').innerHTML='<strong lang="en">English first · Thai + Chinese below. Underlined Chinese words open learning cards.</strong><span lang="th">อังกฤษเป็นหลัก มีไทยและจีนด้านล่าง กดคำจีนที่ขีดเส้นใต้เพื่อเรียนคำศัพท์</span><span lang="zh-Hans">英语为主，下方同时显示泰语和中文。点击带下划线的中文词语学习。</span><small lang="en">Records and source notes keep their original language.</small><small lang="th">ข้อมูลที่กรอกและแหล่งอ้างอิงคงภาษาเดิม</small><small lang="zh-Hans">个人记录与来源说明保留原文。</small>';
  document.querySelector('#word-list').innerHTML=vocabulary.map(w=>`<button type="button" data-word="${w.simplified}" aria-label="Learn word: ${w.simplified}"><span lang="en">${w.english}</span><small lang="th">${w.thai}</small><span lang="zh-Hans">${w.simplified} 📖</span></button>`).join('');
  observer=new MutationObserver(localize);
  document.addEventListener('change',e=>{if(e.target.matches('select'))localize();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-word]');if(b)openWord(b.dataset.word,b);});
  const dialog=document.querySelector('#word-dialog');
  document.querySelector('#word-close').onclick=closeWord;
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWord();}});
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});
  localize();
}
