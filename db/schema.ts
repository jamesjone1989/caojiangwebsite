import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const practiceSessions = sqliteTable(
  "practice_sessions",
  {
    id: text("id").primaryKey(),
    deviceHash: text("device_hash").notNull(),
    topic: text("topic").notNull(),
    transcript: text("transcript").notNull(),
    elapsed: integer("elapsed").notNull(),
    model: text("model").notNull(),
    analysisJson: text("analysis_json").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  table => [index("practice_sessions_device_created_idx").on(table.deviceHash, table.createdAt)]
);
