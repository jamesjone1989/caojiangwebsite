import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const page=readFileSync(new URL('../public/jixingyanjiang/index.html',import.meta.url),'utf8');
const extract=(start,end)=>page.slice(page.indexOf(start),page.indexOf(end));

test('speech screen exposes both input modes',()=>{
  const speech=extract('<section class="screen" id="speechScreen">','<section class="screen" id="loadingScreen">');
  assert.match(speech,/data-mode="text"/); assert.match(speech,/data-mode="voice"/);
});

test('switching input mode preserves text and does not restart the timer',()=>{
  const events=[];
  const controls=['text','voice'].map(mode=>({dataset:{mode},classList:{toggle(){}},setAttribute(){}}));
  const context={practiceMode:'voice',finalTranscript:'旧缓存',fallbackMode:false,
    $:()=>({classList:{contains:()=>true}}),document:{querySelectorAll:()=>controls},
    els:{transcript:{value:'已经讲出的完整内容',focus:()=>events.push('focus')},micPreflight:{classList:{remove(){}},querySelector:()=>({})}},
    stopRecognition:()=>events.push('stop'),startRecognition:()=>events.push('start'),updateSpeechModeUI(){},
  };
  const source=extract('function setPracticeMode(mode)','function updateSpeechModeUI()');
  runInNewContext(source+'setPracticeMode("text");',context);
  assert.equal(context.finalTranscript,'已经讲出的完整内容'); assert.equal(context.els.transcript.value,'已经讲出的完整内容');
  assert.deepEqual(events,['stop','focus']);
  context.els.transcript.value+='，再加上文字输入。';
  runInNewContext(source+'setPracticeMode("voice");',context);
  assert.equal(context.finalTranscript,'已经讲出的完整内容，再加上文字输入。');
  assert.deepEqual(events,['stop','focus','stop','start']);
});

test('late speech results and queued restarts cannot overwrite text after switching',()=>{
  const timers=[];
  let starts=0;
  class Recognition {start(){starts++;} abort(){}}
  const context={recognition:null,recognitionWanted:true,practiceMode:'voice',finalTranscript:'前文',
    window:{SpeechRecognition:Recognition},$:()=>({classList:{contains:()=>true}}),
    els:{transcript:{value:'前文',scrollHeight:100,scrollTop:0,clientHeight:100}},
    setTimeout:fn=>timers.push(fn),updateTranscriptView(){},
  };
  runInNewContext(extract('function setupRecognition()','async function startPractice()')+'setupRecognition();',context);
  const old=context.recognition, lateResult=old.onresult;
  old.onend();
  runInNewContext('stopRecognition();',context);
  context.practiceMode='text'; context.els.transcript.value='用户已经修改的原文';
  lateResult({resultIndex:0,results:[Object.assign([{transcript:'迟到内容'}],{isFinal:true})]});
  timers.forEach(fn=>fn());
  assert.equal(context.els.transcript.value,'用户已经修改的原文'); assert.equal(starts,0); assert.equal(context.recognition,null);
  // A fresh voice session must append to the edited prefix.
  context.practiceMode='voice'; context.recognitionWanted=true; context.finalTranscript=context.els.transcript.value;
  runInNewContext('setupRecognition();',context);
  context.recognition.onresult({resultIndex:0,results:[Object.assign([{transcript:'，继续表达。'}],{isFinal:true})]});
  assert.equal(context.els.transcript.value,'用户已经修改的原文，继续表达。');
});

test('Markdown copy and export use original, suggestions, full rewrite in order',()=>{
  const context={record:{topic:'删掉哪个 App？',transcript:'第一段原文。\n第二段原文。',elapsed:30,createdAt:1,
    analysis:{main_problem:'重复',suggestions:[{title:'精简',evidence:'原句',action:'删去重复',example:'示范句'}],rewritten_article:'改后第一段。\n\n改后第二段。'}},formatTime:()=> '00:30'};
  const source=extract('function normalizeSuggestions(value)','async function copyMarkdown(markdown)');
  const result=runInNewContext(source+'buildReviewMarkdown(record)',context);
  assert.deepEqual(result.match(/^## .*$/gm),['## 1. 原文','## 2. 修改建议','## 3. 修改后的文章']);
  assert.match(result,/> 第一段原文。\n> 第二段原文。/);
  assert.ok(result.includes('改后第一段。\n\n改后第二段。'));
  delete context.record.analysis.rewritten_article;
  assert.match(runInNewContext(source+'buildReviewMarkdown(record)',context),/尚未生成完整改写稿/);
  assert.match(page,/copyMarkdown\(lastReviewMarkdown\)/); assert.match(page,/exportMarkdown\(lastReviewMarkdown/);
});
