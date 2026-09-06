# 开口练独立 API

经用户确认，AI 后端改由自有 Cloudflare Workers 发布，不再依赖 Sites 的整站上传。
页面仍为 `https://caojiang.cn/jixingyanjiang/`；API 为 `https://jixing-api.caojiang.cn`。
已通过 Cloudflare 控制台绑定专用子域名，避免默认 `workers.dev` 在部分网络下解析异常。主站 DNS 记录未修改。

## 维护

在仓库根目录执行：

```sh
node --test tests/practice-connection.test.mjs tests/practice-providers.test.mjs tests/practice-worker.test.mjs tests/practice-independent.test.mjs tests/practice-expression-export.test.mjs
npm run lint
node_modules/.bin/wrangler deploy --config deploy/practice/wrangler.jsonc
```

发布账号需要 Workers 脚本权限；若发布过程要求读取或更新自定义域，还需 `zone:read`。不要删除自定义域配置来绕过权限错误；可在控制台维护现有域名绑定。

前端需单独把 `public/jixingyanjiang/` 同步到现有 `gh-pages` 分支的 `jixingyanjiang/`，不能用源码覆盖整站。

## 数据和凭据

- 新复盘写入专用 `kaikoulian-history` D1；数据库 ID 已固定，后续不要重新创建或替换。
- 旧记录继续保留在原 Sites 数据库。历史接口仅向固定的旧历史地址转发设备凭证，与新记录合并、去重、按时间排序，最多返回 50 条。
- 任一历史来源故障会返回明确提示，不能把“读取失败”显示成“记录被删除”。
- 不复制用户 API Key，也不配置共享服务商 Key。每次请求使用当前用户选择的官方服务商和 Key，密钥不落库、不写日志、不发给旧历史服务。
- `process.env` 在独立部署中被定义为空对象，避免沿用整站服务端 DeepSeek Key。原有官方地址白名单和禁止跟随跳转的安全边界保持不变。
- 固定设备令牌的哈希用于记录隔离；前端原有存储键名不变。切换浏览器、清空站点数据后无法恢复原设备凭证。
- 不修改原 Sites 的数据库、整站部署配置或其他网站页面。

## 线上验收

- `/health` 返回 `expression-rewrite-20260906`。
- 新复盘必须有 `analysis.rewritten_article` 完整改写稿，否则返回 `incomplete_review`，不保存残缺复盘。已有 JSON 存储兼容该字段，无需迁移数据库。
- 使用明确无效的测试 Key，检查接口应返回服务商鉴权错误，而不是旧版 `network_error`。这只能证明网络链路和错误分类正常，不代表用户真实账号的额度和模型权限可用。
- 不使用用户真实 Key 自动生成付费内容。成功复盘的保存和新旧记录合并由本地 Workers + D1 集成测试验证，真实账号测试由用户在原网页完成。
