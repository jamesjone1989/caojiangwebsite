import { cleanJsonText, corsHeaders, json } from "../shared";
import { requestConfig, sendCompletion, upstreamError } from "../provider-request.mjs";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const input = await request.json() as Record<string, unknown>;
    const config = requestConfig(input, request.headers, process.env);
    if (!config.apiKey) return json(request, {error:"尚未配置当前服务商的 API Key",code:"not_configured"},503);
    const { model } = config;
    const recentTopics = Array.isArray(input.recentTopics)
      ? input.recentTopics.map(item => String(item).trim()).filter(Boolean).slice(-8)
      : [];

    const upstream = await sendCompletion(config, [
          {
            role: "system",
            content: "你是一位擅长设计即兴演讲练习的中文出题人。每次只生成一道新鲜、有趣、普通成年人有话可说的题目，适合1至3分钟表达。题目要有明确选择、冲突、经历或想象空间，避免知识问答、敏感隐私、宏大空泛、专业门槛和说教口吻。只输出JSON对象，格式为{\"topic\":\"一道完整题目\"}。题目长度控制在15至45个汉字，不要解释、分类或加引号外的文字。",
          },
          {
            role: "user",
            content: `请随机选择生活观察、职场协作、人际关系、个人成长、科技影响、价值选择、轻松想象或社会日常中的一个方向出题。不要与这些最近题目重复：\n${recentTopics.length ? recentTopics.map((topic, index) => `${index + 1}. ${topic}`).join("\n") : "暂无"}`,
          },
        ], {maxTokens:300, temperature:1, timeout:25000});

    const payload = await upstream.json().catch(() => ({})) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
      model?: string;
    };
    if (!upstream.ok) { const failure = upstreamError(upstream.status,payload); return json(request,failure,failure.status); }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) return json(request, { error: "AI 没有返回题目" }, 502);
    const parsed = JSON.parse(cleanJsonText(content)) as { topic?: unknown };
    const topic = String(parsed.topic || "").trim();
    if (topic.length < 6 || topic.length > 100) return json(request, { error: "AI 返回的题目格式不合适" }, 502);

    return json(request, { topic, model: payload.model || model, source: config.resolvedProvider });
  } catch (error) {
    const message = error instanceof Error ? error.message : "题目生成失败";
    return json(request, { error: message }, 400);
  }
}
