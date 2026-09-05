/** Verify the chosen model by making a minimal real completion, without user speech. */
export async function checkConnection({ apiKey = "", baseUrl = "https://api.deepseek.com", model = "deepseek-v4-flash" } = {}, fetcher = fetch) {
  const fail = (code, error, status) => ({ ok: false, code, error, status });
  if (!apiKey.trim()) return fail("not_configured", "请先填写 DeepSeek API Key，再开始训练。", 503);
  if (baseUrl.replace(/\/+$/, "") !== "https://api.deepseek.com") return fail("invalid_config", "请使用 DeepSeek 官方 API 地址。", 400);
  if (!["deepseek-v4-flash", "deepseek-v4-pro"].includes(model)) return fail("invalid_model", "请选择可用的 DeepSeek 模型。", 400);
  try {
    const response = await fetcher("https://api.deepseek.com/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: "Reply OK." }], thinking: { type: "disabled" }, max_tokens: 8, stream: false }),
      signal: AbortSignal.timeout(15_000), redirect: "error"
    });
    if (!response.ok) {
      if (response.status === 401) return fail("invalid_key", "API Key 无效或已失效，请检查后重新填写。", 401);
      if (response.status === 402) return fail("insufficient_balance", "DeepSeek 余额不足，请充值后重新检查。", 402);
      if (response.status === 429) return fail("rate_limited", "请求过于频繁，请稍后重新检查。", 429);
      if ([400, 403, 404, 422].includes(response.status)) return fail("model_unavailable", "当前模型或账号暂不可用，请检查模型与账号权限。", 502);
      return fail("upstream_unavailable", "DeepSeek 服务暂不可用，请稍后重新检查。", 502);
    }
    const payload = await response.json().catch(() => ({}));
    if (!payload.choices?.[0]?.message?.content?.trim()) return fail("invalid_response", "服务已响应，但未返回有效内容，请重试。", 502);
    return { ok: true, model, checkedAt: Date.now(), status: 200 };
  } catch {
    return fail("network_error", "连接超时或网络不可用，请检查网络后重试。", 504);
  }
}
