import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,readLanguage,LANGUAGE_KEY} from '../i18n.js';
import {labels} from '../translations.js';
import {vocabulary,findWord} from '../vocabulary.js';
import {KEY} from '../model.js';
test('all fixed labels have English and Simplified Chinese translations',()=>{
  assert(Object.keys(labels).length>150);
  for(const [source, target] of Object.entries(labels)){
    assert(target.en && target['zh-Hans'],source);
    assert.equal(translate(source,'en'),target.en,source);
    assert.equal(translate(source,'zh-Hans'),target['zh-Hans'],source);
    assert.equal(translate(source,'th'),source);
  }
  assert.equal(translate('🌴 วันหยุด','zh-Hans'),'🌴 假期');
  assert.equal(translate('โรงเรียนของน้อง','en'),'โรงเรียนของน้อง');
});
test('language preference is separate from personal records and fails safely',()=>{
  assert.notEqual(LANGUAGE_KEY,KEY);
  assert.equal(readLanguage({getItem:()=> 'zh-Hans'}),'zh-Hans');
  assert.equal(readLanguage({getItem:()=> 'zh-Hant'}),'th');
  assert.equal(readLanguage({getItem(){throw Error('blocked')}}),'th');
});
test('vocabulary is contextual, has both scripts, Thai/English and per-character readings',()=>{
  assert.equal(vocabulary.length,42);
  assert.equal(new Set(vocabulary.map(w=>w.simplified)).size,vocabulary.length);
  for(const w of vocabulary){
    assert(w.pinyin && w.thai && w.english);
    assert.equal(w.characters.map(c=>c.simplified).join(''),w.simplified);
    assert.equal(w.characters.map(c=>c.traditional).join(''),w.traditional);
    assert(w.characters.every(c=>c.pinyin&&c.thai&&c.english));
  }
  assert.equal(findWord('學校').pinyin,'xuéxiào');
  assert.equal(findWord('音乐').pinyin,'yīnyuè');
  assert.equal(findWord('教学').pinyin,'jiàoxué');
  assert.match(findWord('日历').note,/歷/);
  assert.match(findWord('发现').note,/髮/);
  assert.match(findWord('国际象棋').note,/Chinese chess/);
  assert.equal(findWord('unknown'),undefined);
});
