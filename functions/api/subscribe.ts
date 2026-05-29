import { signToken } from "../_lib/tokens";

interface Env {
  tianguis_db: D1Database;
  TIANGUIS_HMAC_SECRET: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { email?: string; source?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = (body.source ?? "home").trim().slice(0, 32) || "home";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  const ua = ctx.request.headers.get("user-agent") ?? "";
  const ip = ctx.request.headers.get("cf-connecting-ip") ?? "";
  const [uaHash, ipHash] = await Promise.all([sha256(ua), sha256(ip)]);

  try {
    await ctx.env.tianguis_db
      .prepare(
        `INSERT INTO subscribers (email, source, ua_hash, ip_hash)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(email) DO UPDATE SET
           source = excluded.source,
           unsubscribed_at = NULL,
           unsub_reason = NULL`
      )
      .bind(email, source, uaHash, ipHash)
      .run();
  } catch (e: unknown) {
    return json({ ok: false, error: "db_error" }, 500);
  }

  const unsubToken = await signToken(ctx.env.TIANGUIS_HMAC_SECRET, {
    email,
    purpose: "unsub",
    issuedAt: Math.floor(Date.now() / 1000),
  });

  return json({ ok: true, unsubUrl: `/unsubscribe?t=${unsubToken}` });
};

export const onRequestOptions: PagesFunction = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
