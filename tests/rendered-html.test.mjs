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
  assert.match(html, /你好，/);
  assert.match(html, /我是<span>曹将<\/span>。/);
  assert.match(html, /高效学习：曹将的公开课/);
  assert.match(html, /PPT炼成记/);
  assert.match(html, /AI新手村/);
  assert.match(html, /公众号/);
  assert.match(html, /小红书/);
  assert.match(html, /回声日记/);
  assert.match(html, /小报童/);
  assert.match(html, /如何提升结构化表达能力/);
  assert.match(html, /aria-label="曹将作品地图"/);
  assert.match(html, /aria-label="西瓜老师形象"/);
  assert.match(html, /aria-pressed="true"/);
  assert.doesNotMatch(html, /本站使用 OPPO Sans 4\.0 字体/);
  assert.doesNotMatch(html, /一份可以轻轻转动的自我介绍/);
  assert.doesNotMatch(html, /按住拖动，轻轻转动/);
  assert.doesNotMatch(html, />3D<\/span>西瓜老师/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps the finished visual system and removes starter assets", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /three-stage/);
  assert.match(page, /XiguaTeacher3D/);
  assert.match(page, /https:\/\/t\.zsxq\.com\/2IJ1F/);
  assert.match(
    page,
    /https:\/\/3\.cn\/-2X6z7RF\?jkl=@L46a40PajHTk@ ZH1997/,
  );
  assert.match(
    page,
    /https:\/\/www\.douban\.com\/doubanapp\/dispatch\/book\/25852784\?dt_dapp=1/,
  );
  assert.match(page, /https:\/\/huishengriji\.cn/);
  assert.match(page, /wechat-caojiang-qr\.png/);
  assert.match(page, /微信扫一扫/);
  assert.match(
    page,
    /https:\/\/xiaobot\.net\/p\/jghbd\?refer=c3f68f06-3090-44fa-bf08-434f581889b3/,
  );
  assert.match(page, /30\+ 个职场常见表达场景/);
  assert.match(page, /40\+ 篇内容/);
  assert.doesNotMatch(layout, /@fontsource/);
  assert.match(layout, /og\.png/);
  assert.match(css, /"OPPO Sans"/);
  assert.match(css, /OPPOSans4\.0\.ttf/);
  assert.match(css, /--red:\s*#ff5b53/i);
  assert.match(css, /--green:\s*#8fcb57/i);
  assert.match(css, /--cream:\s*#f7f4ec/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /@react-three|["']three["']/);
  assert.doesNotMatch(css, /violet|purple|indigo|fuchsia/i);
  assert.doesNotMatch(css, /\bInter\b|\bRoboto\b|\bArial\b|system-ui|-apple-system/i);

  await Promise.all([
    access(new URL("../public/fonts/OPPOSans4.0.ttf", import.meta.url)),
    access(new URL("../public/fonts/OPPOSans4.0-License.txt", import.meta.url)),
    access(new URL("../public/xigua-teacher.png", import.meta.url)),
    access(new URL("../public/xigua-teacher-exact.png", import.meta.url)),
    access(new URL("../public/wechat-caojiang-qr.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/favicon.png", import.meta.url)),
  ]);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
