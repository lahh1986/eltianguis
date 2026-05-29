interface ResendSendBody {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
}

interface ResendResponse {
  id?: string;
  message?: string;
  name?: string;
  statusCode?: number;
}

const SITE_URL = "https://eltianguis.sistemia.mx";
const FROM_NAME = "El Tianguis";
const FROM_EMAIL = "tianguis@sistemia.mx";
const REPLY_TO = "hola@sistemia.mx";

export async function sendEmail(
  apiKey: string,
  body: Omit<ResendSendBody, "from" | "reply_to"> & { from?: string; reply_to?: string }
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const payload: ResendSendBody = {
    from: body.from ?? `${FROM_NAME} <${FROM_EMAIL}>`,
    reply_to: body.reply_to ?? REPLY_TO,
    to: body.to,
    subject: body.subject,
    html: body.html,
    text: body.text,
    headers: body.headers,
    tags: body.tags,
  };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data: ResendResponse = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.message ?? `http_${res.status}` };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: "network_error" };
  }
}

export function welcomeEmail(email: string, unsubUrl: string): { subject: string; html: string; text: string } {
  const fullUnsubUrl = unsubUrl.startsWith("http") ? unsubUrl : `${SITE_URL}${unsubUrl}`;

  const subject = "Bienvenido al tianguis";

  const html = `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#FBF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1816;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FBF8F3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border-radius:14px;border:1px solid #E8E4DC;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 8px;border-bottom:1px solid #E8E4DC;">
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;letter-spacing:-0.02em;color:#1A1816;">El Tianguis</div>
              <div style="font-family:monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6660;margin-top:4px;">Por Sistemia</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:500;line-height:1.15;letter-spacing:-0.02em;color:#1A1816;">
                Listo, ya estás dentro.
              </h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4F4A43;">
                Gracias por apuntarte al boletín de El Tianguis. Aquí te vamos a contar cuando llegue al catálogo algo bueno: skills nuevos, agentes, MCPs y herramientas para Claude Code, con énfasis en lo que sirve para devs de México y Latinoamérica.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4F4A43;">
                Cadencia: <strong style="color:#1A1816;">un correo a la semana</strong>, máximo. Si necesitamos avisar algo urgente, intentamos no abusar.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background:#9d422a;border-radius:8px;">
                    <a href="${SITE_URL}/" style="display:inline-block;padding:14px 24px;color:#F4EAD8;text-decoration:none;font-size:15px;font-weight:500;">Explorar el tianguis →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:14px;line-height:1.6;color:#6B6660;">
                Mientras tanto, si tienes un skill que quieras compartir, puedes <a href="${SITE_URL}/publica" style="color:#9d422a;text-decoration:underline;">publicarlo aquí</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#F6EFE3;border-top:1px solid #E8E4DC;font-size:12px;color:#6B6660;line-height:1.6;">
              Recibes este correo porque te apuntaste con <strong>${escapeHtml(email)}</strong> en eltianguis.sistemia.mx.
              <br>
              <a href="${fullUnsubUrl}" style="color:#9d422a;text-decoration:underline;">Darse de baja</a> en un click.
              <br><br>
              Sistemia · Hecho en México, abierto a Latinoamérica.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Listo, ya estás dentro.

Gracias por apuntarte al boletín de El Tianguis. Aquí te vamos a contar cuando llegue al catálogo algo bueno: skills nuevos, agentes, MCPs y herramientas para Claude Code, con énfasis en lo que sirve para devs de México y Latinoamérica.

Cadencia: un correo a la semana, máximo.

Explorar el tianguis: ${SITE_URL}/

¿Tienes un skill que compartir? Publícalo aquí: ${SITE_URL}/publica

---
Recibes este correo porque te apuntaste con ${email} en eltianguis.sistemia.mx.
Darse de baja: ${fullUnsubUrl}

Sistemia · Hecho en México, abierto a Latinoamérica.`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function newsletterEmail(
  email: string,
  unsubUrl: string,
  bodyHtml: string
): { html: string; text: string } {
  const fullUnsubUrl = unsubUrl.startsWith("http") ? unsubUrl : `${SITE_URL}${unsubUrl}`;

  const html = `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FBF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1816;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FBF8F3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width:640px;background:#FFFFFF;border-radius:14px;border:1px solid #E8E4DC;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px 12px;border-bottom:1px solid #E8E4DC;">
              <a href="${SITE_URL}/" style="text-decoration:none;color:#1A1816;">
                <div style="font-family:Georgia,serif;font-size:24px;font-weight:600;letter-spacing:-0.02em;color:#1A1816;">El Tianguis</div>
                <div style="font-family:monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6660;margin-top:3px;">Boletín · por Sistemia</div>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;font-size:16px;line-height:1.65;color:#1A1816;">
              <div class="newsletter-body">${bodyHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#F6EFE3;border-top:1px solid #E8E4DC;font-size:12px;color:#6B6660;line-height:1.6;">
              Recibes este correo porque te apuntaste con <strong>${escapeHtml(email)}</strong> en
              <a href="${SITE_URL}/" style="color:#9d422a;text-decoration:underline;">eltianguis.sistemia.mx</a>.
              <br>
              <a href="${fullUnsubUrl}" style="color:#9d422a;text-decoration:underline;">Darse de baja</a> en un click.
              <br><br>
              Sistemia · Hecho en México, abierto a Latinoamérica.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plain = bodyHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const text = `${plain}

---
Recibes este correo porque te apuntaste con ${email} en eltianguis.sistemia.mx.
Darse de baja: ${fullUnsubUrl}

Sistemia · Hecho en México, abierto a Latinoamérica.`;

  return { html, text };
}
