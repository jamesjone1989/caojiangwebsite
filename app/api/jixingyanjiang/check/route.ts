import { corsHeaders, json } from "../shared";
import { checkConnection } from "../check-connection.mjs";
import { requestConfig } from "../provider-request.mjs";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const result = await checkConnection(requestConfig(input, request.headers, process.env));
    return json(request, result, result.status);
  } catch {
    return json(request, { ok: false, code: "invalid_request", error: "连接设置无法读取，请重新填写。" }, 400);
  }
}
