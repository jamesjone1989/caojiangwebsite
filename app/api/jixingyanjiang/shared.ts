const allowedOrigins = new Set([
  "https://caojiang.cn",
  "https://www.caojiang.cn",
  "https://caojiang-works-map.jone19890801.chatgpt.site",
]);

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://caojiang.cn",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-DeepSeek-Api-Key, X-Practice-Device-Token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
}

export function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export function normalizeBaseUrl(value: unknown) {
  const raw = String(value || "https://api.deepseek.com").trim().replace(/\/+$/, "");
  const withoutPath = raw.replace(/\/chat\/completions$/i, "");
  const url = new URL(withoutPath);
  if (url.protocol !== "https:" || url.hostname !== "api.deepseek.com") {
    throw new Error("仅允许使用 DeepSeek 官方 API 地址 https://api.deepseek.com");
  }
  return withoutPath;
}

export function cleanJsonText(text: unknown) {
  return String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
