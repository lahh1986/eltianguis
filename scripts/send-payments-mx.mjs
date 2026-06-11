#!/usr/bin/env node
// One-shot broadcast for payments-mx skill launch.
// Reuses the existing email template style. Uses mailto: for unsubscribe
// because this script runs outside CF Pages and does not have access to
// TIANGUIS_HMAC_SECRET. With <5 subscribers, that's acceptable; full
// integrated flow lives at /api/admin/send for future broadcasts.

import { marked } from "marked";
import { execSync } from "node:child_process";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY env var.");
  process.exit(1);
}

const DRY_RUN = process.argv.includes("--dry-run");
const TEST_ONLY = process.env.TEST_TO ? process.env.TEST_TO.trim().toLowerCase() : null;

const FROM = "El Tianguis <tianguis@sistemia.mx>";
const REPLY_TO = "hola@sistemia.mx";
const SITE_URL = "https://eltianguis.sistemia.mx";
const UNSUB_MAILTO = "mailto:hola@sistemia.mx?subject=Baja%20El%20Tianguis";

const SUBJECT = "Llegó al tianguis: Payments MX (comisiones reales 2026)";

const BODY_MD = `Hola,

Acaba de aterrizar **Payments MX** en el tianguis. Es un skill que te dice qué gateway y métodos de pago usar en México **sin perder media tarde** leyendo páginas de pricing maquilladas.

Cubre lo que más tumba en una decisión real:

- Comisiones 2026 verificadas de **Conekta, Mercado Pago, Stripe MX, Openpay y Clip** — no las de "desde 2.9%" del marketing, las reales con su fijo, IVA y payout schedule.
- Adopción real de cada método: **OXXO Pay** sigue siendo 10% del e-commerce, **SPEI** ya es 24/7, **CoDi y DiMo** todavía no son rieles serios (esperar al Mundial 2026 a ver si despegan).
- Patrones de **marketplace**: split payments, escrow, KYC del seller. Cuándo conviene MP Marketplace API vs Stripe Connect vs cablear a mano (spoiler: no cablees a mano si retienes fondos del comprador más de 24 horas sin abogado fintech).
- Gotchas que no están en docs: primer payout de Conekta a 10 días, webhooks duplicados de MP, 3DS forzado en Stripe MX, OXXO con tope de $12,000 por orden.

Lo escribimos pensando en un caso real: el marketplace de eltianguis. El ejemplo end-to-end vive en el repo.

[Mira el skill →](${SITE_URL}/s/payments-mx/)

Si trabajas con un gateway o un método que no está cubierto (Kushki, dLocal, Belvo, Prosa) o ves un fee que ya no cuadra, abre PR o contesta este correo. La frescura del catálogo se mantiene con la comunidad.

Próximos en el horno (mismo formato, por país):

- Payments BR (PIX, Boleto)
- Payments AR (Mercado Pago AR, Rapipago, MODO)
- Payments CO (PSE, Nequi, Daviplata)
- Payments CL (WebPay, Khipu, MACH)

Si te late uno antes que otro, contéstanos.

— Luis · Sistemia`;

marked.setOptions({ gfm: true, breaks: true });

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function wrapHtml(email, bodyHtml) {
  return `<!DOCTYPE html>
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
              Para darte de baja, responde este correo con "baja" o escribe a <a href="${UNSUB_MAILTO}" style="color:#9d422a;text-decoration:underline;">hola@sistemia.mx</a>.
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
}

function plainText(email, bodyHtml) {
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

  return `${plain}

---
Recibes este correo porque te apuntaste con ${email} en eltianguis.sistemia.mx.
Para darte de baja, responde con "baja" o escribe a hola@sistemia.mx.

Sistemia · Hecho en México, abierto a Latinoamérica.`;
}

async function sendOne(email, html, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      reply_to: REPLY_TO,
      to: email,
      subject: SUBJECT,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${UNSUB_MAILTO}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [
        { name: "type", value: TEST_ONLY ? "newsletter_test" : "newsletter" },
        { name: "campaign", value: "payments_mx_launch" },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.message ?? `http_${res.status}` };
  return { ok: true, id: data.id };
}

function getActiveSubscribers() {
  if (TEST_ONLY) return [{ email: TEST_ONLY }];
  const raw = execSync(
    `cd ~/eltianguis && npx wrangler d1 execute tianguis-db --remote --command "SELECT email FROM subscribers WHERE unsubscribed_at IS NULL ORDER BY id ASC" --json`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  );
  const start = raw.indexOf("[");
  const parsed = JSON.parse(raw.slice(start));
  return parsed[0].results;
}

function logBroadcast({ recipients, succeeded, failed, durationMs }) {
  const sql = `INSERT INTO broadcasts (subject, body_md, recipients, succeeded, failed, duration_ms, test_only) VALUES ('${SUBJECT.replace(/'/g, "''")}', '${BODY_MD.replace(/'/g, "''")}', ${recipients}, ${succeeded}, ${failed}, ${durationMs}, ${TEST_ONLY ? 1 : 0})`;
  try {
    execSync(
      `cd ~/eltianguis && npx wrangler d1 execute tianguis-db --remote --command "${sql.replace(/"/g, '\\"')}"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    return true;
  } catch (e) {
    console.error("Failed to log broadcast:", e.message);
    return false;
  }
}

async function main() {
  const recipients = getActiveSubscribers();
  console.log(`Recipients: ${recipients.length}`);
  recipients.forEach((r) => console.log(`  - ${r.email}`));
  if (DRY_RUN) {
    console.log("\n[DRY RUN] would send subject:", SUBJECT);
    console.log("[DRY RUN] body markdown length:", BODY_MD.length);
    return;
  }

  const bodyHtml = await marked.parse(BODY_MD);
  const t0 = Date.now();
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const { email } = recipients[i];
    const html = wrapHtml(email, bodyHtml);
    const text = plainText(email, bodyHtml);
    const result = await sendOne(email, html, text);
    if (result.ok) {
      succeeded++;
      console.log(`✓ ${email} → ${result.id}`);
    } else {
      failed++;
      console.log(`✗ ${email} → ${result.error}`);
    }
    if (i < recipients.length - 1) await new Promise((r) => setTimeout(r, 150));
  }

  const durationMs = Date.now() - t0;
  console.log(`\nDone: ${succeeded}/${recipients.length} OK, ${failed} failed in ${durationMs}ms`);

  const logged = logBroadcast({ recipients: recipients.length, succeeded, failed, durationMs });
  console.log(logged ? "Logged to broadcasts table." : "WARN: could not log to broadcasts table.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
