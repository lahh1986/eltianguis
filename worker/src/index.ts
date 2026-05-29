interface Env {
  tianguis_db: D1Database;
  tianguis_backups: R2Bucket;
  BACKUP_ADMIN_KEY?: string;
}

interface BackupResult {
  ok: boolean;
  rows?: number;
  key?: string;
  bytes?: number;
  error?: string;
}

async function runBackup(env: Env): Promise<BackupResult> {
  const subs = await env.tianguis_db
    .prepare(
      `SELECT id, email, source, ua_hash, ip_hash,
              created_at, confirmed, unsubscribed_at, unsub_reason
         FROM subscribers
         ORDER BY id ASC`
    )
    .all();

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mi = String(now.getUTCMinutes()).padStart(2, "0");

  const payload = {
    schema_version: 1,
    backed_up_at: now.toISOString(),
    table: "subscribers",
    row_count: subs.results.length,
    rows: subs.results,
  };
  const body = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(body).byteLength;

  const dayKey = `subscribers/daily/${yyyy}-${mm}-${dd}.json`;
  const versionedKey = `subscribers/versioned/${yyyy}-${mm}-${dd}T${hh}${mi}Z.json`;
  const latestKey = `subscribers/latest.json`;

  await Promise.all([
    env.tianguis_backups.put(dayKey, body, {
      httpMetadata: { contentType: "application/json" },
    }),
    env.tianguis_backups.put(versionedKey, body, {
      httpMetadata: { contentType: "application/json" },
    }),
    env.tianguis_backups.put(latestKey, body, {
      httpMetadata: { contentType: "application/json" },
    }),
  ]);

  return {
    ok: true,
    rows: subs.results.length,
    key: dayKey,
    bytes,
  };
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      runBackup(env).then((result) => {
        console.log("backup", JSON.stringify(result));
      })
    );
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/run" && request.method === "POST") {
      const auth = request.headers.get("authorization") ?? "";
      const expected = env.BACKUP_ADMIN_KEY
        ? `Bearer ${env.BACKUP_ADMIN_KEY}`
        : null;
      if (!expected || auth !== expected) {
        return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const result = await runBackup(env);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        JSON.stringify({
          service: "tianguis-backup",
          cron: "0 9 * * * (nightly 02:00 PT / 03:00 MX)",
          endpoints: {
            "POST /run": "Manual backup (needs BACKUP_ADMIN_KEY bearer)",
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("not_found", { status: 404 });
  },
};
