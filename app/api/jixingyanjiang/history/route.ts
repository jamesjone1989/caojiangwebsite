import { json, corsHeaders } from "../shared";
import { listPracticeSessions } from "../history-store";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const records = await listPracticeSessions(request);
    return json(request, { records });
  } catch (error) {
    const message = error instanceof Error ? error.message : "训练记录读取失败";
    return json(request, { error: message }, 400);
  }
}
