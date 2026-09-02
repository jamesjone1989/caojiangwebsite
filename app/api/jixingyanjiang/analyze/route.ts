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
            content: "你是一位克制、直接的中文即兴演讲教练。参考TED/TEDx演讲者指南的内容逻辑，但不要声称这是TED官方评分或认证。只依据用户提交的真实文字做判断，不臆测语气、停顿、声音和肢体表现，也不要替用户美化。重点检查：是否有一句可带走的核心主张（through-line）；是否让听众在意并建立关联；叙事与解释是否服务于主张；是否用具体例子或证据支撑；结尾是否形成启发、新视角或行动方向。故事和情绪只是传达观点的工具。严格按以下原则分析：1.先忠实复述核心观点；2.提炼一句TED式核心主线；3.只指出一个最明显的问题；4.做TED五维评估；5.用用户已有内容设计四步重组路线；6.给出3条基于原话的具体修改建议。只输出JSON对象，必须包含summary、throughline、main_problem、dimensions、ted_outline、suggestions。dimensions固定5项，每项包含name、rating、comment，name依次为核心主张、听众连接、叙事推进、证据支撑、收束与启发；rating只能是清晰、基本清晰或需加强；comment必须指出原文依据。ted_outline固定4项，每项包含stage、purpose、content，stage依次为让听众在意、说清核心观点、用例子或证据展开、收束到听众启发；content只能重组用户已经讲过的内容，缺少事实时明确写出需要补充什么，不能编造。suggestions固定3项，每项包含title、evidence、action、example：evidence引用或忠实转述一小段原话；action说明具体怎么改；example给出基于原内容的示范说法，不得添加用户没有讲过的事实。拒绝空泛模板。",
          },
          {
            role: "user",
            content: `训练题目：${String(input.prompt || "")}\n输入方式：${input.inputMode === "text" ? "文字输入" : "语音输入后转写"}\n作答时长：${Number(input.elapsed || 0)}秒\n\n用户提交的完整文字：\n${transcript}`,
          },
        ],
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: 2400,
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
