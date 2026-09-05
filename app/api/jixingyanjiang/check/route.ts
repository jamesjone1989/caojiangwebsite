import { corsHeaders, json } from "../shared";
import { checkConnection } from "../check-connection.mjs";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const result = await checkConnection({
      apiKey: request.headers.get("x-deepseek-api-key")?.trim() || process.env.DEEPSEEK_API_KEY || "",
      baseUrl: String(input.baseUrl || "https://api.deepseek.com"),
      model: String(input.model || process.env.DEEPSEEK_MODEL || "deepseek-v4-flash")
    });
    return json(request, result, result.status);
  } catch {
    return json(request, { ok: false, code: "invalid_request", error: "连接设置无法读取，请重新填写。" }, 400);
  }
}
