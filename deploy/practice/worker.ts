import * as check from '../../app/api/jixingyanjiang/check/route';
import * as topic from '../../app/api/jixingyanjiang/topic/route';
import * as analyze from '../../app/api/jixingyanjiang/analyze/route';
import * as status from '../../app/api/jixingyanjiang/status/route';
import { listPracticeSessions } from '../../app/api/jixingyanjiang/history-store';
import { corsHeaders, json } from '../../app/api/jixingyanjiang/shared';

const origins = new Set(['https://caojiang.cn', 'https://www.caojiang.cn', 'https://caojiang-works-map.jone19890801.chatgpt.site']);
const legacyHistory = 'https://caojiang-works-map.jone19890801.chatgpt.site/api/jixingyanjiang/history';
const maxBodyBytes = 100_000;

async function history(request: Request) {
  const token = request.headers.get('x-practice-device-token')?.trim() || '';
  if (token.length < 48 || token.length > 200) return json(request, {error:'当前设备的训练记录凭证无效'}, 400);
  // Keep old records in place. Never send an AI key to the legacy history service.
  const results = await Promise.allSettled([
    listPracticeSessions(request),
    (async () => {
      const response = await fetch(legacyHistory, {
        headers: {'X-Practice-Device-Token':token}, redirect:'manual', signal:AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('legacy_history_unavailable');
      const payload = await response.json() as {records?: Array<{id:string; createdAt:number}>};
      if (!Array.isArray(payload.records)) throw new Error('legacy_history_invalid');
      return payload.records.slice(0,50);
    })(),
  ]);
  if (results.every(result => result.status === 'rejected')) return json(request, {error:'训练记录暂时无法读取，请稍后重试。'}, 503);
  const rows = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
  const records = [...new Map(rows.map(record => [record.id,record])).values()]
    .sort((a,b) => Number(b.createdAt)-Number(a.createdAt)).slice(0,50);
  const warning = results[0].status === 'rejected' ? '新训练记录暂时读取失败，当前仅显示旧记录。'
    : results[1].status === 'rejected' ? '旧训练记录暂时读取失败，当前仅显示新记录；旧记录仍保留，请稍后重试。' : '';
  return json(request, {records,warning});
}

const worker = {
  async fetch(request: Request) {
    try {
      const origin = request.headers.get('origin');
      if (origin && !origins.has(origin)) return json(request, {error:'此来源不允许访问。'}, 403);
      const path = new URL(request.url).pathname;
      const route = path.replace(/^\/api\/jixingyanjiang\//, '');
      if (path === '/health' && request.method === 'GET') return json(request, {ok:true,release:'independent-api-20260906'});
      if (!path.startsWith('/api/jixingyanjiang/') || !['check','topic','analyze','history','status'].includes(route)) return json(request, {error:'接口不存在。'}, 404);
      if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:corsHeaders(request)});
      if (request.method === 'GET' && route === 'history') return history(request);
      if (request.method === 'GET' && route === 'status') return status.GET(request);
      if (request.method !== 'POST' || !['check','topic','analyze'].includes(route)) return json(request, {error:'请求方式不支持。'}, 405);
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json(request, {error:'请求必须使用 JSON。'}, 415);
      if (Number(request.headers.get('content-length')) > maxBodyBytes) return json(request, {error:'提交内容过长。'}, 413);
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      if (reader) while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBodyBytes) { await reader.cancel(); return json(request, {error:'提交内容过长。'}, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {bytes.set(chunk,offset); offset += chunk.byteLength;}
      try {const input = JSON.parse(new TextDecoder().decode(bytes)); if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();}
      catch {return json(request, {error:'请求内容不是有效的 JSON 对象。'},400);}
      const bounded = new Request(request.url,{method:'POST',headers:request.headers,body:bytes});
      if (route === 'analyze') {
        const token = request.headers.get('x-practice-device-token')?.trim() || '';
        if (token.length < 48 || token.length > 200) return json(request,{error:'当前设备的训练记录凭证无效，请刷新页面。'},400);
        return analyze.POST(bounded);
      }
      return route === 'check' ? check.POST(bounded) : topic.POST(bounded);
    } catch {
      return json(request, {error:'网站服务暂不可用，请稍后重试。'},503);
    }
  },
};
export default worker;
