import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

const sourceDirectory = new URL("../../workplace-good-habits/", import.meta.url);
const clientDirectory = new URL("dist/client/", sourceDirectory);
const workerUrl = new URL("dist/server/index.js", sourceDirectory);
const outputDirectory = new URL("../dist/github-pages/goodhabits/", import.meta.url);
const isCustomDomain = process.env.CUSTOM_DOMAIN === "true";
const siteOrigin = isCustomDomain
  ? "https://caojiang.cn/goodhabits/"
  : "https://jamesjone1989.github.io/caojiangwebsite/goodhabits/";

workerUrl.searchParams.set("goodhabits", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", {
    headers: { accept: "text/html", host: "localhost" },
  }),
  {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`Good habits export failed with status ${response.status}.`);
}

let html = await response.text();
if (!html.includes("职场加分好习惯") || !html.includes("321")) {
  throw new Error("Good habits export did not render the expected content.");
}

html = html
  .replaceAll("http://localhost/", "__GOOD_HABITS_ORIGIN__")
  .replaceAll("/assets/", "./assets/")
  .replaceAll('="/og.png', '="./og.png')
  .replaceAll("__GOOD_HABITS_ORIGIN__", siteOrigin)
  .replace(
    'self.__VINEXT_RSC_NAV__={"pathname":"/","searchParams":[]}',
    'self.__VINEXT_RSC_NAV__={"pathname":"/goodhabits/","searchParams":[]}',
  );

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });

async function rewriteClientAssetPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) {
      await rewriteClientAssetPaths(entryUrl);
      continue;
    }

    if (entry.name.endsWith(".js")) {
      const source = await readFile(entryUrl, "utf8");
      await writeFile(entryUrl, source.replaceAll("/assets/", "./assets/"));
    }

    if (entry.name.endsWith(".css")) {
      const source = await readFile(entryUrl, "utf8");
      await writeFile(entryUrl, source.replaceAll("/assets/", "./"));
    }
  }
}

await rewriteClientAssetPaths(outputDirectory);
await writeFile(new URL("index.html", outputDirectory), html);
