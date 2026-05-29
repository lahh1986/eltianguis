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
  let body: { token?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  const token = (body.token ?? "").trim();
  if (!token) return json({ ok: false, error: "missing_token" }, 400);

  const payload = await verifyToken(ctx.env.TIANGUIS_HMAC_SECRET, token, "unsub");
  if (!payload) return json({ ok: false, error: "invalid_token" }, 401);

  try {
    await ctx.env.tianguis_db
      .prepare(
        `UPDATE subscribers
         SET unsubscribed_at = NULL,
             unsub_reason = NULL
         WHERE email = ?1`
      )
      .bind(payload.email)
      .run();
    return json({ ok: true, email: payload.email });
  } catch {
    return json({ ok: false, error: "db_error" }, 500);
  }
};
