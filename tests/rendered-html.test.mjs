import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Cao Jiang works map", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>曹将｜欢迎来到我的作品地图<\/title>/);
  assert.match(html, /你好，我是曹将。/);
  assert.match(html, /高效学习：曹将的公开课/);
  assert.match(html, /PPT炼成记/);
  assert.match(html, /AI新手村/);
  assert.match(html, /公众号/);
  assert.match(html, /小红书/);
  assert.match(html, /回声日记/);
  assert.match(html, /aria-label="曹将作品地图"/);
  assert.match(html, /aria-pressed="true"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps the finished visual system and removes starter assets", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /story-stage/);
  assert.match(page, /prefers-reduced-motion|mobile-map/);
  assert.match(page, /https:\/\/huishengriji\.cn/);
  assert.match(layout, /@fontsource\/zcool-kuaile/);
  assert.match(layout, /@fontsource-variable\/noto-sans-sc/);
  assert.match(layout, /og\.png/);
  assert.match(css, /"ZCOOL KuaiLe"/);
  assert.match(css, /"Noto Sans SC Variable"/);
  assert.match(css, /--red:\s*#ff5753/i);
  assert.match(css, /--green:\s*#79b74a/i);
  assert.match(css, /--yellow:\s*#f7c95c/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(css, /violet|purple|indigo|fuchsia/i);
  assert.doesNotMatch(css, /\bInter\b|\bRoboto\b|\bArial\b|system-ui|-apple-system/i);

  await Promise.all([
    access(new URL("../public/xigua-teacher.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/favicon.png", import.meta.url)),
  ]);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
