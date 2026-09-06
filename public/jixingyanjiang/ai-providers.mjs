// Shared allowlist: never accept an arbitrary proxy destination.
export const providers = {
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', models: ['deepseek-v4-flash', 'deepseek-v4-pro'], note: '使用 DeepSeek 开放平台的 API Key。' },
  openai: { name: 'OpenAI（ChatGPT 模型）', baseUrl: 'https://api.openai.com/v1', models: ['gpt-5.6-luna', 'chat-latest', 'gpt-5.6-terra', 'gpt-5.6-sol', 'gpt-6-astra', 'gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini'], note: '新设置默认 GPT-5.6 Luna；ChatGPT 当前版本使用 chat-latest。旧模型选择不会自动更改。需填写 OpenAI 开放平台 API Key，按 API 账户计费。模型目录核对于 2026-09-06。' },
  qwen: { name: '通义千问 / 百炼', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', models: ['qwen-plus', 'qwen-turbo'], note: '此预设为北京地域。其他地域请在自定义兼容接口中选择对应官方地址。' },
  siliconflow: { name: '硅基流动', baseUrl: 'https://api.siliconflow.cn/v1', models: ['deepseek-ai/DeepSeek-V4-Flash', 'Qwen/Qwen3-32B'], note: '模型 ID 须与硅基流动控制台一致；可填写该平台提供的其他文本模型。' },
  custom: { name: '自定义兼容接口', baseUrl: '', models: [], note: '仅支持下方列出的官方地址和 Chat Completions 文本模型，不支持任意中转站、Claude 原生 Messages 或 Responses-only 模型。' }
};
export const modelLabels = {
  'gpt-5.6-luna':'GPT-5.6 Luna · 日常练习',
  'chat-latest':'ChatGPT 当前版本 · chat-latest',
  'gpt-5.6-terra':'GPT-5.6 Terra',
  'gpt-5.6-sol':'GPT-5.6 Sol',
  'gpt-6-astra':'GPT-6 Astra · 深度分析',
  'gpt-4.1-mini':'GPT-4.1 mini · 旧版',
  'gpt-4.1':'GPT-4.1 · 旧版',
  'gpt-4o-mini':'GPT-4o mini · 旧版'
};
export const allowedBases = {
  'https://api.deepseek.com': 'deepseek',
  'https://api.deepseek.com/v1': 'deepseek',
  'https://api.openai.com/v1': 'openai',
  'https://dashscope.aliyuncs.com/compatible-mode/v1': 'qwen',
  'https://dashscope-intl.aliyuncs.com/compatible-mode/v1': 'qwen',
  'https://api.siliconflow.cn/v1': 'siliconflow',
  'https://api.siliconflow.com/v1': 'siliconflow'
};
export function normalizeConfig(input = {}) {
  const provider = input.provider || 'deepseek';
  if (!Object.hasOwn(providers, provider)) throw new Error('请选择已支持的服务商。');
  const preset = providers[provider];
  const baseUrl = String(input.baseUrl || preset.baseUrl).trim().replace(/\/+$/, '').replace(/\/chat\/completions$/, '');
  const resolvedProvider = Object.hasOwn(allowedBases, baseUrl) ? allowedBases[baseUrl] : '';
  if (!resolvedProvider || (provider !== 'custom' && provider !== resolvedProvider)) throw new Error('地址不在当前服务商支持的官方地址列表中，请检查 API 地址。');
  const model = String(input.model || preset.models[0] || '').trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/@+-]{0,159}$/.test(model)) throw new Error('请填写有效的文本模型 ID。');
  return {provider, baseUrl, model, resolvedProvider};
}
export function completionBody(config, messages, {maxTokens = 2400, temperature = 0.35, json = true} = {}) {
  const body = {model:config.model, messages, stream:false};
  if (config.resolvedProvider === 'openai') {
    body.max_completion_tokens = maxTokens;
    if (/^gpt-5\.6-(luna|terra|sol)(-|$)/.test(config.model)) body.reasoning_effort = 'none';
    if (/^gpt-6-astra(-|$)/.test(config.model)) {
      body.reasoning_effort = 'low';
      body.max_completion_tokens += 2048;
    }
  } else {
    body.max_tokens = maxTokens;
    body.temperature = Math.min(1, temperature);
  }
  if (config.resolvedProvider === 'deepseek') body.thinking = {type:'disabled'};
  if (['qwen','siliconflow'].includes(config.resolvedProvider)) body.enable_thinking = false;
  if (json) body.response_format = {type:'json_object'};
  return body;
}
