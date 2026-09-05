// Shared allowlist: never accept an arbitrary proxy destination.
export const providers = {
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', models: ['deepseek-v4-flash', 'deepseek-v4-pro'], note: '使用 DeepSeek 开放平台的 API Key。' },
  openai: { name: 'OpenAI（ChatGPT 模型）', baseUrl: 'https://api.openai.com/v1', models: ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini'], note: '填写 OpenAI 开放平台的 API Key，不是 ChatGPT 登录密码。API 按开放平台账户计费。' },
  qwen: { name: '通义千问 / 百炼', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', models: ['qwen-plus', 'qwen-turbo'], note: '此预设为北京地域。其他地域请在自定义兼容接口中选择对应官方地址。' },
  siliconflow: { name: '硅基流动', baseUrl: 'https://api.siliconflow.cn/v1', models: ['deepseek-ai/DeepSeek-V4-Flash', 'Qwen/Qwen3-32B'], note: '模型 ID 须与硅基流动控制台一致；可填写该平台提供的其他文本模型。' },
  custom: { name: '自定义兼容接口', baseUrl: '', models: [], note: '仅支持下方列出的官方地址和 Chat Completions 文本模型，不支持任意中转站、Claude 原生 Messages 或 Responses-only 模型。' }
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
  } else {
    body.max_tokens = maxTokens;
    body.temperature = Math.min(1, temperature);
  }
  if (config.resolvedProvider === 'deepseek') body.thinking = {type:'disabled'};
  if (['qwen','siliconflow'].includes(config.resolvedProvider)) body.enable_thinking = false;
  if (json) body.response_format = {type:'json_object'};
  return body;
}
