interface Env {
  tianguis_db: D1Database;
}

interface TrackBody {
  type?: string;
  path?: string;
  skill_slug?: string;
  ref?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  session_id?: string;
}

const ALLOWED_TYPES = new Set([
  "page_view",
  "wa_click",
  "github_click",
  "install_view",
  "publica_view",
  "newsletter_subscribe",
  "newsletter_view",
  "skill_card_click",
  "type_filter",
]);

async function sha256Short(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

const noContent = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export const onRequestOptions: PagesFunction = () => noContent();

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: TrackBody;
  try {
    body = await ctx.request.json();
  } catch {
    return noContent();
  }

  const type = (body.type ?? "").trim();
  if (!ALLOWED_TYPES.has(type)) return noContent();

  const path = (body.path ?? "").slice(0, 200) || null;
  const skill_slug = (body.skill_slug ?? "").slice(0, 80) || null;
  const ref = (body.ref ?? "").slice(0, 200) || null;
  const utm_source = body.utm?.source?.slice(0, 80) || null;
  const utm_medium = body.utm?.medium?.slice(0, 80) || null;
  const utm_campaign = body.utm?.campaign?.slice(0, 80) || null;
  const session_id = (body.session_id ?? "").slice(0, 32) || null;

  const ua = ctx.request.headers.get("user-agent") ?? "";
  const ip = ctx.request.headers.get("cf-connecting-ip") ?? "";
  const [ua_hash, ip_hash] = await Promise.all([sha256Short(ua), sha256Short(ip)]);

  ctx.waitUntil(
    ctx.env.tianguis_db
      .prepare(
        `INSERT INTO events
           (type, path, skill_slug, ref, utm_source, utm_medium, utm_campaign,
            ua_hash, ip_hash, session_id)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`
      )
      .bind(
        type,
        path,
        skill_slug,
        ref,
        utm_source,
        utm_medium,
        utm_campaign,
        ua_hash,
        ip_hash,
        session_id
      )
      .run()
      .catch(() => undefined)
  );

  return noContent();
};
