import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { checkConnection } from '../app/api/jixingyanjiang/check-connection.mjs';

const config = { apiKey:'test-placeholder-not-a-real-key', model:'deepseek-v4-pro' };
test('missing key and unapproved destinations never make an upstream request', async () => {
  const never = () => { throw new Error('must not call upstream'); };
  assert.equal((await checkConnection({}, never)).code, 'not_configured');
  assert.equal((await checkConnection({...config,baseUrl:'https://example.com'},never)).code, 'invalid_config');
});
test('checks the selected model with a minimal completion, not key presence', async () => {
  let calls = 0;
  const result = await checkConnection(config, async (url,options) => {
    calls++;
    assert.equal(url, 'https://api.deepseek.com/chat/completions');
    const body = JSON.parse(options.body);
    assert.equal(body.model, config.model);
    assert.equal(body.max_tokens, 8);
    assert.equal(body.messages[0].content, 'Reply OK.');
    return Response.json({choices:[{message:{content:'OK'}}]});
  });
  assert.equal(result.ok,true); assert.equal(calls,1);
});
test('invalid credentials, depleted balance, limits and unavailable model are distinguished', async () => {
  for(const [status,code] of [[401,'invalid_key'],[402,'insufficient_balance'],[429,'rate_limited'],[404,'model_unavailable'],[503,'upstream_unavailable']]) {
    const result = await checkConnection(config,async () => new Response('',{status}));
    assert.equal(result.ok,false); assert.equal(result.code,code);
  }
});
test('empty success and timeout do not produce a connected status',async () => {
  assert.equal((await checkConnection(config,async () => Response.json({}))).ok,false);
  assert.equal((await checkConnection(config,async () => {throw new Error('timeout');})).code,'network_error');
});

const page = readFileSync(new URL('../public/jixingyanjiang/index.html', import.meta.url), 'utf8');
const startSource = page.slice(page.indexOf('async function startPractice()'), page.indexOf('function beginCountdown()'));
function startHarness(connected, mode = 'voice') {
  const events = [];
  const node = () => ({value:'保留此前原文',style:{setProperty(){}},parentElement:{classList:{toggle(){}}}});
  const els = Object.fromEntries(['transcript','copyMarkdown','exportMarkdown','prep','prepLabel','prepTopic','prepRing','speechState','speechNote','dictate'].map(k => [k,node()]));
  els.settings = {open:false,showModal(){events.push('settings');}};
  const context = {checkingConnection:false,drawingTopic:false,reviewing:false,currentTopic:'如果必须删掉一个 App',prepGeneration:0,prepTimer:null,speechTimer:null,practiceMode:mode,els,
    verifyConnection:async()=>{events.push('check');return connected;},clearInterval(){},$:node,
    showScreen:id=>events.push(id),startRecognition:()=>events.push('mic'),beginCountdown:()=>events.push('countdown'),setTimeout(){}};
  return {events,els,run:()=>runInNewContext(startSource+'startPractice()',context)};
}
test('failed preflight preserves text and never opens microphone or countdown',async()=>{
  const h=startHarness(false); await h.run();
  assert.deepEqual(h.events,['check','settings']);
  assert.equal(h.els.transcript.value,'保留此前原文');
});
test('successful preflight enters selected input mode only after verification',async()=>{
  for(const mode of ['voice','text']) {
    const h=startHarness(true,mode); await h.run();
    assert.deepEqual(h.events,['check','prepScreen',mode==='voice'?'mic':'countdown']);
    assert.equal(h.els.prepTopic.textContent,'如果必须删掉一个 App');
  }
});
