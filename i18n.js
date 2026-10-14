import { labels } from './translations.js?v=titles-1';
import { vocabulary, findWord } from './vocabulary.js';
// English interface; Thai and Chinese are added only to fixed headings. Legacy preferences are ignored.
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
const excluded = 'script,style,textarea,input,[data-original],#word-dialog,.ml-label,#language-note';
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
export const usesTitleLanguages = tag => ['H1','H2','H3'].includes(tag);
function localize() {
  observer?.disconnect();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT), nodes=[];
  let node;
  while((node=walker.nextNode())) if(node.textContent.trim()&&!node.parentElement.closest(excluded)) nodes.push(node);
  for(const textNode of nodes){
    const source=textNode.textContent, parts=stackedParts(source);
    const heading=textNode.parentElement.closest('h1,h2,h3');
    if(heading && usesTitleLanguages(heading.tagName) && parts.en!==parts.zh){
      const label=document.createElement('span');label.className='ml-label';
      label.innerHTML=`<span class="ml-primary" lang="en">${escapeHTML(parts.en)}</span><span class="ml-secondary" lang="th">${escapeHTML(parts.th)}</span><span class="ml-secondary ml-chinese" lang="zh-Hans">${chineseHTML(parts.zh,true)}</span>`;
      textNode.replaceWith(label);
    }else{
      const previous=sources.get(textNode);
      const original=previous?.result===source?previous.source:source;
      const result=translate(original);
      sources.set(textNode,{source:original,result});
      if(result!==source)textNode.textContent=result;
    }
  }
  document.querySelectorAll('[aria-label],[title]').forEach(el=>{
    if(el.closest(excluded)||el.hasAttribute('data-record-label')) return;
    for(const attr of ['aria-label','title']) if(el.hasAttribute(attr)){
      const current=el.getAttribute(attr);let entry=sources.get(el)||{};
      if(!entry[attr]||entry[attr].result!==current) entry[attr]={source:current};
      const result=translate(entry[attr].source);
      entry[attr].result=result;sources.set(el,entry);if(current!==result)el.setAttribute(attr,result);
    }
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}
function wordContent(word) {
  return `<p class="eyebrow">WORD FIRST</p><h2 id="word-title" lang="zh-Hans">${word.simplified}</h2><p class="traditional" lang="zh-Hant">${word.traditional}</p><p class="pinyin" lang="zh-Latn-pinyin">${word.pinyin}</p><p class="word-meaning"><span lang="th">${word.thai}</span><br><span lang="en">${word.english}</span></p><p class="quiet">Simplified / Traditional</p><h3>Character details</h3><p class="quiet">Readings below are for this word. Character glosses do not add up to its whole meaning.</p><div class="character-grid">${word.characters.map(c=>`<article><b><span lang="zh-Hans">${c.simplified}</span> / <span lang="zh-Hant">${c.traditional}</span></b><span class="pinyin" lang="zh-Latn-pinyin">${c.pinyin}</span><span lang="th">${c.thai}</span><span lang="en">${c.english}</span></article>`).join('')}</div>${word.note?`<p class="reading-note" lang="en">⚑ ${escapeHTML(word.note)}</p>`:''}<p class="quiet">Curated contextual vocabulary · CC-CEDICT / MDBG. Not automatic translation.</p>`;
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
  document.querySelector('#language-note').textContent='English interface · Thai and Chinese on titles. Tap underlined Chinese title words to learn. Records and source notes keep their original language.';
  observer=new MutationObserver(localize);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-word]');if(b)openWord(b.dataset.word,b);});
  const dialog=document.querySelector('#word-dialog');
  document.querySelector('#word-close').onclick=closeWord;
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWord();}});
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});
  localize();
}
