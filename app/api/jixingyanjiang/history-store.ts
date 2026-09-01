import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { practiceSessions } from "@/db/schema";

const encoder = new TextEncoder();
let schemaReady: Promise<unknown> | null = null;

async function getHistoryDb() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("训练记录存储暂不可用");
  if (!schemaReady) {
    schemaReady = env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS practice_sessions (
        id text PRIMARY KEY NOT NULL,
        device_hash text NOT NULL,
        topic text NOT NULL,
        transcript text NOT NULL,
        elapsed integer NOT NULL,
        model text NOT NULL,
        analysis_json text NOT NULL,
        created_at integer NOT NULL
      )`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS practice_sessions_device_created_idx ON practice_sessions (device_hash, created_at)"),
    ]).catch(error => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
  return drizzle(env.DB, { schema: { practiceSessions } });
}

async function deviceHash(request: Request) {
  const token = request.headers.get("x-practice-device-token")?.trim() || "";
  if (token.length < 48 || token.length > 200) throw new Error("当前设备的训练记录凭证无效");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function savePracticeSession(request: Request, input: {
  topic: string;
  transcript: string;
  elapsed: number;
  model: string;
  analysis: unknown;
}) {
  const hash = await deviceHash(request);
  const analysisJson = JSON.stringify(input.analysis);
  if (analysisJson.length > 40_000) throw new Error("复盘内容过长，无法保存训练记录");

  const record = {
    id: crypto.randomUUID(),
    deviceHash: hash,
    topic: input.topic.slice(0, 500),
    transcript: input.transcript.slice(0, 20_000),
    elapsed: Math.max(1, Math.min(86_400, Math.round(input.elapsed))),
    model: input.model.slice(0, 100),
    analysisJson,
    createdAt: Date.now(),
  };
  const db = await getHistoryDb();
  await db.insert(practiceSessions).values(record);
  return { ...record, deviceHash: undefined, analysis: input.analysis, analysisJson: undefined };
}

export async function listPracticeSessions(request: Request) {
  const hash = await deviceHash(request);
  const db = await getHistoryDb();
  const rows = await db
    .select()
    .from(practiceSessions)
    .where(eq(practiceSessions.deviceHash, hash))
    .orderBy(desc(practiceSessions.createdAt))
    .limit(50);

  return rows.map(row => {
    let analysis: unknown = {};
    try { analysis = JSON.parse(row.analysisJson); } catch {}
    return {
      id: row.id,
      topic: row.topic,
      transcript: row.transcript,
      elapsed: row.elapsed,
      model: row.model,
      createdAt: row.createdAt,
      analysis,
    };
  });
}
