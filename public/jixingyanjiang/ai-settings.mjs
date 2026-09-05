import { normalizeConfig, providers } from './ai-providers.mjs';
const settingsKey = 'kaikoulian.ai.profiles.v1';
const keySlot = config => 'kaikoulian.ai.key.session.v1:'+config.provider+':'+config.baseUrl;
export function createSettingsStore(local, session) {
  let state = {active:'deepseek',profiles:{}};
  try {
    const saved = JSON.parse(local.getItem(settingsKey) || 'null');
    if (saved && providers[saved.active] && saved.profiles) state = saved;
  } catch { /* Invalid preferences must not break the practice page. */ }
  if (!state.profiles.deepseek) {
    let legacy = {};
    try { legacy = JSON.parse(local.getItem('kaikoulian.deepseek.v2') || '{}'); } catch { /* defaults */ }
    try {
      const config = normalizeConfig({...legacy,provider:'deepseek'});
      state.profiles.deepseek = config;
      const key = session.getItem('kaikoulian.deepseek.key.session.v1');
      if (key) session.setItem(keySlot(config),key);
    } catch { state.profiles.deepseek = normalizeConfig({}); }
  }
  function config() {
    try { return normalizeConfig(state.profiles[state.active] || {provider:state.active}); }
    catch { return normalizeConfig({}); }
  }
  return {
    config,
    profile(provider) { return state.profiles[provider] || null; },
    key(config) { return session.getItem(keySlot(config)) || ''; },
    save(input, key) {
      const next = normalizeConfig(input);
      if (key.trim()) session.setItem(keySlot(next),key.trim()); else session.removeItem(keySlot(next));
      state = {active:next.provider, profiles:{...state.profiles,[next.provider]:next}};
      local.setItem(settingsKey,JSON.stringify(state));
      return next;
    }
  };
}
