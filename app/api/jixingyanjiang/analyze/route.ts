import { cleanJsonText, corsHeaders, json, normalizeBaseUrl } from "../shared";
import { savePracticeSession } from "../history-store";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-deepseek-api-key")?.trim() || process.env.DEEPSEEK_API_KEY || "";
    if (!apiKey) return json(request, { error: "尚未配置 DeepSeek API Key", code: "not_configured" }, 503);

    const input = await request.json() as Record<string, unknown>;
    const transcript = String(input.transcript || "").trim();
    if (transcript.length < 8) return json(request, { error: "转写内容太短，请先完成一段表达" }, 400);
    if (transcript.length > 20_000) return json(request, { error: "转写内容过长，请缩短后重试" }, 400);

    const baseUrl = normalizeBaseUrl(input.baseUrl || process.env.DEEPSEEK_BASE_URL);
    const requestedModel = String(input.model || "");
    const model = /^deepseek-[a-z0-9._-]+$/i.test(requestedModel)
      ? requestedModel
      : process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "你是一位克制、直接的中文即兴演讲教练。只依据用户的真实转写做判断，不臆测语气、停顿和肢体表现，也不要替用户美化。严格按以下原则分析：1.先复述你听到的核心观点，不要替用户美化；2.只指出一个最明显的问题；3.从结构、具体性、简洁度和说服力四方面简评；4.给出3条基于本次原话的具体修改建议。只输出JSON对象，必须包含summary、main_problem、dimensions、suggestions。dimensions固定4项，每项包含name、rating、comment；name依次为结构、具体性、简洁度、说服力；rating只能是清晰、基本清晰或需加强；comment是基于原文的一句状态描述。suggestions固定3项，每项包含title、evidence、action、example：title概括修改方向；evidence引用或忠实转述一小段原话；action说明具体怎么改；example给出基于原内容的示范说法，不得添加用户没有讲过的事实。建议必须分别回应本次表达中的真实问题，不能使用空泛模板。",
          },
          {
            role: "user",
            content: `训练题目：${String(input.prompt || "")}\n作答时长：${Number(input.elapsed || 0)}秒\n\n语音转写原文：\n${transcript}`,
          },
        ],
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: 1800,
        stream: false,
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const payload = await upstream.json().catch(() => ({})) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
      model?: string;
      usage?: unknown;
    };
    if (!upstream.ok) {
      return json(request, { error: payload.error?.message || `DeepSeek 请求失败（${upstream.status}）` }, 502);
    }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) return json(request, { error: "DeepSeek 没有返回可用的分析结果" }, 502);

    let analysis: unknown;
    try {
      analysis = JSON.parse(cleanJsonText(content));
    } catch {
      return json(request, { error: "DeepSeek 返回格式无法解析，请重试" }, 502);
    }

    const resolvedModel = payload.model || model;
    let record = null;
    try {
      record = await savePracticeSession(request, {
        topic: String(input.prompt || ""),
        transcript,
        elapsed: Number(input.elapsed || 0),
        model: resolvedModel,
        analysis,
      });
    } catch (error) {
      console.error("Failed to save practice history", error);
    }

    return json(request, { analysis, model: resolvedModel, usage: payload.usage || null, record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "分析失败，请稍后重试";
    return json(request, { error: message }, 400);
  }
}
