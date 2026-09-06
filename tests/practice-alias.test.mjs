import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import "../scripts/sync-practice-alias.mjs";

test("new practice URL serves the complete app and relative modules without changing storage or API", async () => {
  for (const file of ["index.html", "ai-providers.mjs", "ai-settings.mjs"]) {
    const original = await readFile(new URL(`../public/jixingyanjiang/${file}`, import.meta.url), "utf8");
    const alias = await readFile(new URL(`../public/kaikoulian/${file}`, import.meta.url), "utf8");
    assert.equal(alias, original);
  }
});
