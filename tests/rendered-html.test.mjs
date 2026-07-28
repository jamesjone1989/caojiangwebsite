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
  assert.match(html, /<title>曹将｜把复杂的事情讲清楚<\/title>/);
  assert.match(html, /你好，/);
  assert.match(html, /我是<span>曹将<\/span>。/);
  assert.match(
    html,
    /写了14年文章，出过两本书，研究AI，擅长表达，下面是我的一些作品。/,
  );
  assert.doesNotMatch(html, /我写作、做产品/);
  assert.doesNotMatch(html, /也一直在研究怎样把复杂的事情讲清楚/);
  assert.match(html, /高效学习：曹将的公开课/);
  assert.match(html, /PPT炼成记/);
  assert.match(html, /AI 新手村/);
  assert.match(html, /零基础，/);
  assert.match(html, /也能快速上手 AI。/);
  assert.match(html, /100\+/);
  assert.match(html, /新手系统课程/);
  assert.match(html, /可复制案例/);
  assert.match(html, /20\+/);
  assert.match(html, /独家资料/);
  assert.match(html, /办公提效/);
  assert.match(html, /知识管理/);
  assert.match(html, /创意产出/);
  assert.match(html, /生活提质/);
  assert.match(html, /个人成长/);
  assert.match(html, /扫码加入/);
  assert.match(html, /微信扫一扫/);
  assert.match(html, /AI 新手村加入二维码/);
  assert.match(html, /案例与独家资料/);
  assert.match(html, /HR AI启发/);
  assert.match(html, /Codex橙皮书/);
  assert.match(html, /ChatGPT 图片提示词库/);
  assert.match(html, /07\.20—07\.26/);
  assert.match(html, /公众号/);
  assert.match(html, /小红书/);
  assert.match(html, /回声日记/);
  assert.match(html, /小报童/);
  assert.match(html, /如何提升结构化表达能力/);
  assert.match(html, /aria-label="页面导航"/);
  assert.match(html, /戴着西瓜帽、穿白色外套的西瓜老师/);
  assert.doesNotMatch(html, /本站使用 OPPO Sans 4\.0 字体/);
  assert.doesNotMatch(html, /一份可以轻轻转动的自我介绍/);
  assert.doesNotMatch(html, /按住拖动，轻轻转动/);
  assert.doesNotMatch(html, />3D<\/span>西瓜老师/);
  assert.doesNotMatch(html, /class="hero-caption"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps the finished visual system and removes starter assets", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /hero-section/);
  assert.match(page, /highlights-section/);
  assert.match(page, /IntersectionObserver/);
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
  assert.match(page, /ai-village-qr\.png/);
  assert.match(
    page,
    /听见\s*<br \/>\s*自己，\s*<br \/>\s*也听见\s*<br \/>\s*时间的回声。/,
  );
  assert.match(page, /微信扫一扫/);
  assert.match(
    page,
    /https:\/\/xiaobot\.net\/p\/jghbd\?refer=c3f68f06-3090-44fa-bf08-434f581889b3/,
  );
  assert.match(page, /30\+ 个常见场景/);
  assert.match(page, /40\+ 篇内容/);
  assert.doesNotMatch(layout, /@fontsource/);
  assert.match(layout, /og\.png/);
  assert.match(css, /"OPPO Sans"/);
  assert.match(css, /OPPOSans4\.0\.ttf/);
  assert.match(css, /--red:\s*#ff5b50/i);
  assert.match(css, /--green:\s*#81c943/i);
  assert.match(css, /--warm:\s*#fff7ec/i);
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
    access(new URL("../public/ai-village-qr.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/favicon.png", import.meta.url)),
    access(
      new URL(
        "../public/editorial/xigua-fullbody-transparent-v3-cropped.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-casebook-cover.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-course-map.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-cases-map.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-resource-hr-ai.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-resource-codex.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-resource-chatgpt-prompts.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-cases-20260706.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-cases-20260713.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/ai-village-cases-20260720.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/editorial/book-efficient-learning.jpg",
        import.meta.url,
      ),
    ),
    access(new URL("../public/editorial/book-ppt.jpg", import.meta.url)),
    access(
      new URL(
        "../public/editorial/echo-journal-screen-v3.png",
        import.meta.url,
      ),
    ),
    access(
      new URL("../public/editorial/xiaobot-column.png", import.meta.url),
    ),
  ]);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
