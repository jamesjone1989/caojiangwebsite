import { normalizeConfig, completionBody } from '../../../public/jixingyanjiang/ai-providers.mjs';

export function requestConfig(input = {}, headers = new Headers(), env = {}) {
  const config = normalizeConfig(input);
  // Never forward the site's DeepSeek credential to a user-selected provider.
  const key = headers.get('x-ai-api-key')?.trim() || (config.provider === 'deepseek' ? headers.get('x-deepseek-api-key')?.trim() || env.DEEPSEEK_API_KEY || '' : '');
  return {...config, apiKey:key};
}
export function upstreamError(status, payload = {}) {
  const fail = (code,error,httpStatus = status) => ({ok:false,code,error,status:httpStatus});
  if (status >= 300 && status < 400) return fail('upstream_redirect','AI 接口返回了跳转；为避免泄露 Key，已停止请求，请核对官方 API 地址。',502);
  const reason = String(payload?.error?.code || payload?.error?.type || '');
  if (status === 402 || /insufficient_quota|insufficient_balance|Arrearage/i.test(reason)) return fail('insufficient_balance','当前服务商的余额或额度不足，请在对应开放平台检查。',402);
  if (status === 401) return fail('invalid_key','API Key 无效或已失效，请核对服务商、地域和 Key。');
  if (status === 429) return fail('rate_limited','请求过于频繁，请稍后重新检查。');
  if ([400,403,404,422].includes(status)) return fail('model_unavailable','当前模型、接口参数或账号权限不可用，请检查模型 ID 与账户。',502);
  return fail('upstream_unavailable','AI 服务暂不可用，请稍后重试。',502);
}
export async function sendCompletion(config, messages, options = {}, fetcher = fetch) {
  return fetcher(config.baseUrl+'/chat/completions', {
    method:'POST', headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.apiKey},
    body:JSON.stringify(completionBody(config,messages,options)),
    // workerd supports follow/manual only. Never follow redirects with a user's key.
    signal:AbortSignal.timeout(options.timeout || 45_000), redirect:'manual'
  });
}
export function connectionFailure(error) {
  if (['TimeoutError','AbortError'].includes(error?.name)) return {ok:false,code:'upstream_timeout',error:'AI 服务响应超时，请稍后重试，或选择速度更快的模型。',status:504};
  return {ok:false,code:'upstream_network_error',error:'网站服务器暂时无法连接 AI 服务；这不表示你的 Key 无效，请稍后重试。',status:502};
}
