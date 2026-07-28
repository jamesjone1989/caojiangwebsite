import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const pagesDirectory = new URL("../dist/github-pages/", import.meta.url);
const clientDirectory = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("github-pages", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
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

if (!response.ok) {
  throw new Error(`GitHub Pages export failed with status ${response.status}.`);
}

const html = await response.text();
if (!html.includes("曹将")) {
  throw new Error("GitHub Pages export did not render the homepage.");
}

await rm(pagesDirectory, { recursive: true, force: true });
await mkdir(pagesDirectory, { recursive: true });
await cp(clientDirectory, pagesDirectory, { recursive: true });
await writeFile(new URL("index.html", pagesDirectory), html);
await writeFile(new URL(".nojekyll", pagesDirectory), "");
