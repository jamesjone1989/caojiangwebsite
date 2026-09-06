import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';

test('independent Worker: provider calls, stored reviews, old records and security boundaries',async t=>{
  const bundle = await build({entryPoints:['deploy/practice/worker.ts'],bundle:true,write:false,format:'esm',platform:'browser',external:['cloudflare:workers'],define:{'process.env':'{}'}});
  const token = 'a'.repeat(64);
  const calls = [];
  let legacyFails = false;
  let omitRewrite = false;
  const mf = new Miniflare({modules:true,compatibilityDate:'2026-05-22',script:bundle.outputFiles[0].text,d1Databases:['DB'],
    outboundService:async request=>{
      const url = new URL(request.url);
      calls.push(url.hostname);
      if (url.hostname === 'caojiang-works-map.jone19890801.chatgpt.site') {
        assert.equal(request.headers.has('x-ai-api-key'),false);
        assert.equal(request.headers.has('authorization'),false);
        if (legacyFails) return new Response('unavailable',{status:503});
        return Response.json({records:request.headers.get('x-practice-device-token') === token ? [{id:'old-record',createdAt:1,topic:'旧题目',transcript:'旧演讲记录',analysis:{summary:'旧复盘'}}] : []});
      }
      assert.ok(['api.deepseek.com','api.openai.com','dashscope.aliyuncs.com','api.siliconflow.cn'].includes(url.hostname));
      assert.equal(url.pathname.endsWith('/chat/completions'),true);
      if (request.headers.get('authorization') === 'Bearer invalid-test-key') return Response.json({error:{code:'invalid_api_key'}},{status:401});
      if (request.headers.get('authorization') === 'Bearer redirect-test-key') return new Response(null,{status:302,headers:{Location:'https://example.com/never-follow'}});
      const body = await request.json();
      let content = 'OK';
      if (body.messages[0].content.includes('出题人')) content = JSON.stringify({topic:'如果手机只能保留三个 App，你会选择哪些？'});
      else if (body.messages[0].role === 'system') {
        assert.ok(body.messages.some(message=>message.content.includes('rewritten_article') && message.content.includes('不得杜撰')));
        content = JSON.stringify({summary:'选择删掉短视频 App，给阅读留时间。',throughline:'把时间留给重要的事',main_problem:'缺少例子',dimensions:[],ted_outline:[],suggestions:[],...(omitRewrite ? {} : {rewritten_article:'我会删掉短视频 App。\n\n我想把时间留给阅读，而不是一直刷手机。'})});
      }
      return Response.json({model:body.model,choices:[{message:{content}}]});
    },
  });
  const req = (route,body,extra={})=>mf.dispatchFetch('https://worker.test/api/jixingyanjiang/'+route,{
    method:'POST',headers:{Origin:'https://caojiang.cn','Content-Type':'application/json','X-AI-Api-Key':'fake-test-key','X-Practice-Device-Token':token,...extra},body:JSON.stringify(body),
  });
  try {
    await t.test('all four provider checks reach upstream and return success',async()=>{
      for (const provider of ['deepseek','openai','qwen','siliconflow']) {
        const response = await req('check',{provider});
        assert.equal(response.status,200); assert.equal((await response.json()).ok,true);
        assert.equal(response.headers.get('access-control-allow-origin'),'https://caojiang.cn');
      }
    });
    await t.test('401 and redirects are not misreported as timeouts',async()=>{
      assert.equal((await (await req('check',{}, {'X-AI-Api-Key':'invalid-test-key'})).json()).code,'invalid_key');
      const before = calls.length;
      assert.equal((await (await req('check',{}, {'X-AI-Api-Key':'redirect-test-key'})).json()).code,'upstream_redirect');
      assert.equal(calls.length,before+1);
    });
    await t.test('topics and reviews use real route logic and D1 storage',async()=>{
      assert.match((await (await req('topic',{})).json()).topic,/App/);
      const response = await req('analyze',{prompt:'删掉哪个 App？',transcript:'我会删掉短视频 App，因为我希望把时间留给阅读。',elapsed:60,inputMode:'text'});
      const review = await response.json();
      assert.equal(response.status,200,JSON.stringify(review));
      assert.ok(review.record?.id); assert.match(review.analysis.summary,/阅读/);
      assert.match(review.record.analysis.rewritten_article,/我会删掉短视频/);
    });
    await t.test('missing rewritten article is not saved or treated as complete',async()=>{
      omitRewrite=true;
      const response=await req('analyze',{transcript:'我会删掉短视频 App，因为我希望把时间留给阅读。'});
      assert.equal(response.status,502);
      assert.equal((await response.json()).code,'incomplete_review');
      omitRewrite=false;
    });
    await t.test('new and legacy records are merged, with device isolation',async()=>{
      const history = async (device=token)=>(await mf.dispatchFetch('https://worker.test/api/jixingyanjiang/history',{headers:{'X-Practice-Device-Token':device,'X-AI-Api-Key':'must-not-forward'}})).json();
      const result = await history();
      assert.equal(result.records.length,2); assert.equal(result.records[1].id,'old-record');
      assert.match(result.records[0].analysis.rewritten_article,/阅读/);
      assert.equal((await history('b'.repeat(64))).records.length,0);
      legacyFails=true;
      const partial = await history(); assert.equal(partial.records.length,1); assert.match(partial.warning,/旧训练记录/);
    });
    await t.test('bad origin, oversized bodies and bad credentials fail before upstream',async()=>{
      const before=calls.length;
      assert.equal((await req('check',{}, {Origin:'https://evil.test'})).status,403);
      assert.equal((await req('check',{padding:'a'.repeat(100_001)})).status,413);
      assert.equal((await req('analyze',{transcript:'some long enough text'}, {'X-Practice-Device-Token':''})).status,400);
      assert.equal((await req('check',{provider:'custom',baseUrl:'https://evil.test/v1',model:'fake'})).status,400);
      assert.equal(calls.length,before);
      assert.equal((await mf.dispatchFetch('https://worker.test/api/jixingyanjiang/check',{method:'OPTIONS',headers:{Origin:'https://caojiang.cn'}})).status,204);
    });
  } finally {await mf.dispose();}
});
