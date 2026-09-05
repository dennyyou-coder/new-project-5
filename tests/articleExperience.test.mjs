import assert from 'node:assert/strict';
import test from 'node:test';
import {addArticleContents, getTopicReading} from '../lib/articleExperience.ts';

test('contents keeps heading markup and gives repeated titles distinct, collision-free anchors',()=>{
  const input='<div id="wcb-section-1"></div><h2>A &amp; <em>B</em></h2><p>Unchanged</p><h2>A &amp; B</h2>';
  const result=addArticleContents(input);
  assert.deepEqual(result.sections,[{id:'wcb-section-2',labelHtml:'A &amp; B'},{id:'wcb-section-3',labelHtml:'A &amp; B'}]);
  assert.equal(result.content.replace(/ id="wcb-section-[23]"/g,''),input);
});

test('contents strips links from navigation labels and leaves existing heading anchors intact',()=>{
  const result=addArticleContents('<h2 id="original">Existing anchor</h2><h2><a href="/brands">Brands</a></h2>');
  assert.deepEqual(result.sections,[{id:'wcb-section-1',labelHtml:'Brands'}]);
  assert.ok(result.content.includes('<h2 id="original">Existing anchor</h2>'));
  assert.deepEqual(addArticleContents('<p>A short article</p>').sections,[]);
});

const item=(slug,overrides={})=>({slug,category:'Industry',primaryBrands:[],tags:[],contentClass:'editorial',sortDate:'2026-09-01',...overrides});
test('reading recommendations favor a shared brand and topic over a merely recent story',()=>{
  const current=item('current',{primaryBrands:['anker'],tags:['Robotics']});
  const brand=item('same-brand',{primaryBrands:['anker']});
  const topic=item('same-topic',{tags:['robotics']});
  const recent=item('recent',{sortDate:'2026-09-05'});
  const guide=item('guide',{contentClass:'search',primaryBrands:['anker']});
  assert.deepEqual(getTopicReading([recent,guide,current,topic,brand],current,[recent]).map(a=>a.slug),['same-brand','same-topic','recent']);
});
test('reading recommendations keep episode navigation separate and avoid repeating a series',()=>{
  const current=item('current',{series:'own-series'});
  const own=item('own',{series:'own-series'});
  const a=item('a',{series:'other-series'});
  const b=item('b',{series:'other-series'});
  const c=item('c');const d=item('d');
  const result=getTopicReading([current,own,a,b,c,d],current,[c,d]);
  assert.equal(result.length,3);
  assert.ok(!result.some(x=>x.slug==='current'||x.slug==='own'));
  assert.equal(result.filter(x=>x.series==='other-series').length,1);
});
