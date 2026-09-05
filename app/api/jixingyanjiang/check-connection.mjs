import { normalizeConfig } from '../../../public/jixingyanjiang/ai-providers.mjs';
import { sendCompletion, upstreamError } from './provider-request.mjs';

/** Minimal real completion, containing no speech or personal content. */
export async function checkConnection(input = {}, fetcher = fetch) {
  const fail = (code,error,status) => ({ok:false,code,error,status});
  let config;
  try { config = {...normalizeConfig(input),apiKey:String(input.apiKey || '').trim()}; }
  catch(error) { return fail('invalid_config',error.message,400); }
  if (!config.apiKey) return fail('not_configured','请先填写当前服务商的 API Key，再开始训练。',503);
  try {
    const response = await sendCompletion(config,[{role:'user',content:'Reply OK.'}],{maxTokens:config.resolvedProvider === 'openai' ? 256 : 16,json:false,timeout:20_000},fetcher);
    const payload = await response.json().catch(()=>({}));
    if (!response.ok) return upstreamError(response.status,payload);
    if (typeof payload.choices?.[0]?.message?.content !== 'string' || !payload.choices[0].message.content.trim()) return fail('invalid_response','服务已响应，但没有返回有效文字；请选择非纯推理模型或重试。',502);
    return {ok:true,provider:config.provider,model:config.model,checkedAt:Date.now(),status:200};
  } catch { return fail('network_error','连接超时或网络不可用，请检查网络后重试。',504); }
}
