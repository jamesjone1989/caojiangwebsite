import { cp, mkdir } from "node:fs/promises";

// Keep both URLs on the same app and same origin-wide settings/history.
// Maintain a single source so future practice fixes reach both URLs.
const source = new URL("../public/jixingyanjiang/", import.meta.url);
const target = new URL("../public/kaikoulian/", import.meta.url);
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
