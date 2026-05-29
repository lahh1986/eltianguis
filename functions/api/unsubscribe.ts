import { verifyToken } from "../_lib/tokens";

interface Env {
  tianguis_db: D1Database;
  TIANGUIS_HMAC_SECRET: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { token?: string; reason?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const token = (body.token ?? "").trim();
  const reason = (body.reason ?? "").trim().slice(0, 240) || null;
  if (!token) return json({ ok: false, error: "missing_token" }, 400);

  const payload = await verifyToken(ctx.env.TIANGUIS_HMAC_SECRET, token, "unsub");
  if (!payload) return json({ ok: false, error: "invalid_token" }, 401);

  try {
    const result = await ctx.env.tianguis_db
      .prepare(
        `UPDATE subscribers
         SET unsubscribed_at = unixepoch(),
             unsub_reason = ?2
         WHERE email = ?1 AND unsubscribed_at IS NULL`
      )
      .bind(payload.email, reason)
      .run();
    return json({ ok: true, email: payload.email, changed: result.meta.changes ?? 0 });
  } catch {
    return json({ ok: false, error: "db_error" }, 500);
  }
};
