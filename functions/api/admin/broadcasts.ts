import { checkAdmin, json } from "../../_lib/admin";

interface Env {
  tianguis_db: D1Database;
  TIANGUIS_ADMIN_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const denied = checkAdmin(ctx.request, ctx.env.TIANGUIS_ADMIN_KEY);
  if (denied) return denied;

  const rows = await ctx.env.tianguis_db
    .prepare(
      `SELECT id, subject, sent_at, recipients, succeeded, failed,
              duration_ms, test_only, notes
         FROM broadcasts
         ORDER BY sent_at DESC
         LIMIT 50`
    )
    .all();

  return json({ ok: true, broadcasts: rows.results });
};
