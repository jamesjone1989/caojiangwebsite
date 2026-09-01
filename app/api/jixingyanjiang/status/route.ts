import { corsHeaders, json } from "../shared";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  const requestApiKey = request.headers.get("x-deepseek-api-key")?.trim() || "";
  return json(request, {
    provider: "DeepSeek",
    configured: Boolean(requestApiKey || process.env.DEEPSEEK_API_KEY),
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    transcription: "browser",
  });
}
