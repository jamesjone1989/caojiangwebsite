import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeConfig, providers, completionBody } from '../public/jixingyanjiang/ai-providers.mjs';
import { createSettingsStore } from '../public/jixingyanjiang/ai-settings.mjs';
import { requestConfig, sendCompletion, upstreamError } from '../app/api/jixingyanjiang/provider-request.mjs';
import { checkConnection } from '../app/api/jixingyanjiang/check-connection.mjs';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const memory = () => { const map=new Map(); return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),map}; };
test('presets resolve exact endpoints; hostile URLs and provider mismatches are blocked',()=>{
  for(const provider of Object.keys(providers).filter(x=>x!=='custom')) assert.equal(normalizeConfig({provider}).resolvedProvider,provider);
  for(const baseUrl of ['http://127.0.0.1','https://127.0.0.1','https://[::1]','https://169.254.169.254','https://api.openai.com.evil.test/v1','https://u:p@api.openai.com/v1','https://api.openai.com:444/v1','https://api.openai.com/v1?x=1','https://api.openai.com/v1/../v1','https://example.com/v1']) {
    assert.throws(()=>normalizeConfig({provider:'custom',baseUrl,model:'test'}));
  }
  assert.throws(()=>normalizeConfig({provider:'deepseek',baseUrl:providers.openai.baseUrl}));
});
test('separate API credentials; server key and legacy key never leak to other providers',()=>{
  const env={DEEPSEEK_API_KEY:'site-deepseek-only'};
  const headers=new Headers({'X-DeepSeek-Api-Key':'legacy-deepseek'});
  for(const provider of ['openai','qwen','siliconflow','custom']) {
    const input=provider==='custom'?{provider,baseUrl:providers.deepseek.baseUrl,model:'deepseek-v4-pro'}:{provider};
    assert.equal(requestConfig(input,headers,env).apiKey,'');
  }
  assert.equal(requestConfig({},headers,env).apiKey,'legacy-deepseek');
  assert.equal(requestConfig({provider:'openai'},new Headers({'X-AI-Api-Key':'openai-only'}),env).apiKey,'openai-only');
});
test('provider-specific parameters are not mixed into OpenAI calls',()=>{
  const body=completionBody(normalizeConfig({provider:'openai'}),[{role:'user',content:'test'}]);
  assert.equal(body.max_completion_tokens,2400);
  for(const key of ['max_tokens','thinking','enable_thinking','temperature']) assert.equal(key in body,false);
  assert.deepEqual(completionBody(normalizeConfig({}),[]).thinking,{type:'disabled'});
  assert.equal(completionBody(normalizeConfig({provider:'qwen'}),[]).enable_thinking,false);
});
test('all provider preflights use selected model and destination, reject redirects',async()=>{
  for(const provider of ['deepseek','openai','qwen','siliconflow']) {
    const config={...normalizeConfig({provider}),apiKey:'test-placeholder'};
    let called=false;
    const result=await checkConnection(config,async(url,options)=>{
      called=true; assert.equal(url,config.baseUrl+'/chat/completions'); assert.equal(options.redirect,'error');
      assert.equal(JSON.parse(options.body).model,config.model);
      return Response.json({choices:[{message:{content:'OK'}}]});
    });
    assert.equal(called,true); assert.equal(result.ok,true);
  }
});
test('OpenAI insufficient_quota is distinguished from rate limits',()=>{
  assert.equal(upstreamError(429,{error:{code:'insufficient_quota'}}).code,'insufficient_balance');
  assert.equal(upstreamError(429,{}).code,'rate_limited');
});
test('legacy settings migrate without losing the DeepSeek key; keys stay out of local storage',()=>{
  const local=memory(),session=memory();
  local.setItem('kaikoulian.deepseek.v2',JSON.stringify({baseUrl:providers.deepseek.baseUrl,model:'deepseek-v4-pro'}));
  session.setItem('kaikoulian.deepseek.key.session.v1','old-deepseek-key');
  let store=createSettingsStore(local,session);
  assert.equal(store.config().model,'deepseek-v4-pro');
  assert.equal(store.key(store.config()),'old-deepseek-key');
  const openai=normalizeConfig({provider:'openai'});
  assert.equal(store.key(openai),'');
  store.save(openai,'new-openai-key');
  store=createSettingsStore(local,session);
  assert.equal(store.config().provider,'openai');
  assert.equal(store.key(store.config()),'new-openai-key');
  assert.equal(store.key(normalizeConfig({provider:'deepseek'})),'old-deepseek-key');
  assert.equal([...local.map.values()].join('').includes('new-openai-key'),false);
  assert.equal(store.key(normalizeConfig({provider:'custom',baseUrl:openai.baseUrl,model:openai.model})),'');
});
test('editing draft profiles cannot change active settings before save',()=>{
  const store=createSettingsStore(memory(),memory());
  const draft=normalizeConfig({provider:'openai'});
  assert.equal(draft.provider,'openai'); assert.equal(store.config().provider,'deepseek');
  store.save(draft,''); assert.equal(store.config().provider,'openai');
});
test('review/topic bodies retain JSON output and contain only the selected key',async()=>{
  for(const provider of ['openai','qwen','siliconflow','deepseek']) {
    const config={...normalizeConfig({provider}),apiKey:provider+'-key'};
    await sendCompletion(config,[{role:'user',content:'Output JSON'}],{maxTokens:4000},async(url,options)=>{
      assert.equal(options.headers.Authorization,'Bearer '+provider+'-key');
      assert.equal(JSON.parse(options.body).response_format.type,'json_object');
      return Response.json({});
    });
  }
});

test('topic and review routes complete with each provider and preserve review history',async()=>{
  for(const kind of ['topic','analyze']) for(const provider of ['openai','deepseek','qwen','siliconflow']) {
    const source=readFileSync(new URL('../app/api/jixingyanjiang/'+kind+'/route.ts',import.meta.url),'utf8');
    const result={topic:'如果必须删掉一个常用 App，你会删掉哪个？',summary:'真实观点',throughline:'一句主张',main_problem:'缺少例子',dimensions:[],ted_outline:[],suggestions:[]};
    const calls=[];
    const module={exports:{}};
    const shared={cleanJsonText:x=>x,json:(req,data,status=200)=>Response.json(data,{status}),corsHeaders:()=>({})};
    const service={requestConfig,upstreamError,sendCompletion:async(config,messages,options)=>{
      calls.push(config);
      assert.ok(messages[0].content.includes('JSON'));
      assert.ok(options.maxTokens>0);
      return Response.json({choices:[{message:{content:JSON.stringify(result)}}],model:config.model});
    }};
    runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{
      module,exports:module.exports,Response,process:{env:{}},console,
      require:id=>id==='../shared'?shared:id==='../provider-request.mjs'?service:{savePracticeSession:async(req,record)=>({id:'test-record',...record})}
    });
    const response=await module.exports.POST(new Request('https://app.test/api/'+kind,{
      method:'POST',headers:{'Content-Type':'application/json','X-AI-Api-Key':provider+'-key'},
      body:JSON.stringify({provider,transcript:'我选择删掉这个应用，因为它每天占用了我太多时间。',prompt:'删掉一个 App',elapsed:60})
    }));
    assert.equal(response.status,200);
    const payload=await response.json();
    assert.equal(calls[0].resolvedProvider,provider);
    assert.equal(calls[0].apiKey,provider+'-key');
    if(kind==='topic') assert.equal(payload.source,provider);
    else { assert.equal(payload.analysis.summary,'真实观点'); assert.equal(payload.record.transcript,'我选择删掉这个应用，因为它每天占用了我太多时间。'); assert.ok(payload.record.model.startsWith(provider+' / ')); }
  }
});
