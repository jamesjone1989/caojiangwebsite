import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { fileURLToPath } from 'node:url';
import { normalizeConfig, completionBody, providers } from '../public/jixingyanjiang/ai-providers.mjs';
import { checkConnection } from '../app/api/jixingyanjiang/check-connection.mjs';

test('current OpenAI models have explicit compatible reasoning settings',()=>{
  for(const model of ['chat-latest','gpt-5.6-luna','gpt-5.6-terra','gpt-5.6-sol','gpt-6-astra']) assert.ok(providers.openai.models.includes(model));
  assert.equal(providers.openai.models[0],'gpt-5.6-luna');
  assert.equal(completionBody(normalizeConfig({provider:'openai',model:'gpt-5.6-luna'}),[]).reasoning_effort,'none');
  assert.equal(completionBody(normalizeConfig({provider:'openai',model:'gpt-6-astra'}),[]).reasoning_effort,'low');
  assert.equal('reasoning_effort' in completionBody(normalizeConfig({provider:'openai',model:'gpt-4.1-mini'}),[]),false);
});

test('redirect responses never become a connection success or forward credentials',async()=>{
  let calls=0;
  const result=await checkConnection({provider:'openai',apiKey:'fake-test-key'},async(url,options)=>{
    calls++; assert.equal(options.redirect,'manual');
    return new Response(null,{status:302,headers:{Location:'https://example.com/steal'}});
  });
  assert.equal(calls,1); assert.equal(result.ok,false); assert.equal(result.code,'upstream_redirect');
});

test('network failure and actual timeout are distinct',async()=>{
  const result=await checkConnection({apiKey:'fake-test-key'},async()=>{throw new TypeError('fetch failed');});
  assert.equal(result.code,'upstream_network_error');
  assert.equal(result.status,502);
});

test('real Workers runtime accepts request options and reaches an upstream response',async()=>{
  // A local HTTP upstream inside Miniflare makes this deterministic, with no real keys/network.
  const source = await build({
    stdin:{contents:`
      import {sendCompletion,requestConfig} from './app/api/jixingyanjiang/provider-request.mjs';
      export default {async fetch(request,env) {
        const config=requestConfig({provider:'openai'},new Headers({'X-AI-Api-Key':'fake-test-key'}));
        try {
          const response=await sendCompletion(config,[{role:'user',content:'Reply OK.'}],{json:false},
            (url,options)=>env.UPSTREAM.fetch(url,options));
          return Response.json({status:response.status,body:await response.json()});
        } catch(error) {return Response.json({error:error.message},{status:500});}
      }};
    `,resolveDir:fileURLToPath(new URL('..',import.meta.url))},
    bundle:true,write:false,format:'esm',platform:'browser'
  });
  const mf=new Miniflare({
    modules:true,compatibilityDate:'2026-05-22',script:source.outputFiles[0].text,
    serviceBindings:{UPSTREAM:async request=>{
      const data=await request.json();
      return Response.json({model:data.model,hasKey:request.headers.has('Authorization')},{status:401});
    }}
  });
  try {
    const response=await mf.dispatchFetch('https://local.test');
    const payload=await response.json();
    assert.equal(response.status,200,JSON.stringify(payload));
    assert.equal(payload.status,401);
    assert.equal(payload.body.model,'gpt-5.6-luna');
    assert.equal(payload.body.hasKey,true);
  } finally {await mf.dispose();}
});
