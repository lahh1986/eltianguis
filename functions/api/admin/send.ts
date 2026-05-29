import { marked } from "marked";
import { checkAdmin, json } from "../../_lib/admin";
import { sendEmail, newsletterEmail } from "../../_lib/email";
import { signToken } from "../../_lib/tokens";

interface Env {
  tianguis_db: D1Database;
  TIANGUIS_ADMIN_KEY?: string;
  TIANGUIS_HMAC_SECRET: string;
  RESEND_API_KEY?: string;
}

interface SendBody {
  subject?: string;
  bodyMd?: string;
  testEmail?: string;
}

marked.setOptions({ gfm: true, breaks: true });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const denied = checkAdmin(ctx.request, ctx.env.TIANGUIS_ADMIN_KEY);
  if (denied) return denied;

  if (!ctx.env.RESEND_API_KEY) {
    return json({ ok: false, error: "resend_not_configured" }, 503);
  }

  let body: SendBody;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const subject = (body.subject ?? "").trim();
  const bodyMd = body.bodyMd ?? "";
  const testEmail = (body.testEmail ?? "").trim().toLowerCase();

  if (!subject) return json({ ok: false, error: "missing_subject" }, 400);
  if (!bodyMd.trim()) return json({ ok: false, error: "missing_body" }, 400);

  const bodyHtml = await marked.parse(bodyMd);
  const isTest = Boolean(testEmail);

  let recipients: { email: string }[];
  if (isTest) {
    recipients = [{ email: testEmail }];
  } else {
    const rs = await ctx.env.tianguis_db
      .prepare(
        `SELECT email FROM subscribers
           WHERE unsubscribed_at IS NULL
           ORDER BY id ASC`
      )
      .all();
    recipients = rs.results as { email: string }[];
  }

  const t0 = Date.now();
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const { email } = recipients[i];

    const unsubToken = await signToken(ctx.env.TIANGUIS_HMAC_SECRET, {
      email,
      purpose: "unsub",
      issuedAt: Math.floor(Date.now() / 1000),
    });
    const unsubUrl = `/unsubscribe?t=${unsubToken}`;
    const { html, text } = newsletterEmail(email, unsubUrl, bodyHtml);

    const result = await sendEmail(ctx.env.RESEND_API_KEY, {
      to: email,
      subject,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<https://eltianguis.sistemia.mx${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [
        { name: "type", value: isTest ? "newsletter_test" : "newsletter" },
        { name: "subject_hash", value: simpleHash(subject) },
      ],
    });

    if (result.ok) succeeded++;
    else failed++;

    if (i < recipients.length - 1) await sleep(150);
  }

  const durationMs = Date.now() - t0;

  await ctx.env.tianguis_db
    .prepare(
      `INSERT INTO broadcasts
         (subject, body_md, recipients, succeeded, failed, duration_ms, test_only)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    )
    .bind(
      subject,
      bodyMd,
      recipients.length,
      succeeded,
      failed,
      durationMs,
      isTest ? 1 : 0
    )
    .run();

  return json({
    ok: true,
    recipients: recipients.length,
    succeeded,
    failed,
    duration_ms: durationMs,
    test_only: isTest,
  });
};

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16);
}
