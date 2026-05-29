import { checkAdmin, json } from "../../_lib/admin";

interface Env {
  tianguis_db: D1Database;
  TIANGUIS_ADMIN_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const denied = checkAdmin(ctx.request, ctx.env.TIANGUIS_ADMIN_KEY);
  if (denied) return denied;

  const [totals, sources, recent, broadcasts] = await Promise.all([
    ctx.env.tianguis_db
      .prepare(
        `SELECT
           COUNT(*)                                                  AS total,
           SUM(CASE WHEN unsubscribed_at IS NULL THEN 1 ELSE 0 END)  AS active,
           SUM(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 ELSE 0 END) AS unsubscribed
         FROM subscribers`
      )
      .first(),
    ctx.env.tianguis_db
      .prepare(
        `SELECT source, COUNT(*) AS n
           FROM subscribers
           WHERE unsubscribed_at IS NULL
           GROUP BY source
           ORDER BY n DESC
           LIMIT 10`
      )
      .all(),
    ctx.env.tianguis_db
      .prepare(
        `SELECT email, source, created_at
           FROM subscribers
           ORDER BY id DESC
           LIMIT 10`
      )
      .all(),
    ctx.env.tianguis_db
      .prepare(`SELECT COUNT(*) AS n FROM broadcasts`)
      .first(),
  ]);

  return json({
    ok: true,
    totals,
    sources: sources.results,
    recent: recent.results,
    broadcasts_count: broadcasts?.n ?? 0,
  });
};
