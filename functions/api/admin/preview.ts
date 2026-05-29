import { marked } from "marked";
import { checkAdmin, json } from "../../_lib/admin";
import { newsletterEmail } from "../../_lib/email";

interface Env {
  TIANGUIS_ADMIN_KEY?: string;
}

marked.setOptions({ gfm: true, breaks: true });

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const denied = checkAdmin(ctx.request, ctx.env.TIANGUIS_ADMIN_KEY);
  if (denied) return denied;

  let body: { subject?: string; bodyMd?: string; sampleEmail?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const subject = (body.subject ?? "").trim();
  const bodyMd = body.bodyMd ?? "";
  const sampleEmail = (body.sampleEmail ?? "tu@correo.mx").trim();

  if (!subject) return json({ ok: false, error: "missing_subject" }, 400);
  if (!bodyMd.trim()) return json({ ok: false, error: "missing_body" }, 400);

  const bodyHtml = await marked.parse(bodyMd);
  const { html, text } = newsletterEmail(
    sampleEmail,
    "/unsubscribe?t=PREVIEW_TOKEN",
    bodyHtml
  );

  return json({ ok: true, subject, html, text });
};
