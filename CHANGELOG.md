# Changelog — El Tianguis

Detalle por sesión. Headline más reciente vive en `CLAUDE.md` §11.

---

## 2026-06-10 (noche) — Skill `mexicanismos-mx` agregado al catálogo

**Trigger:** Pregunta de Luis sobre construir skill de español MX por región usando la base de datos del corpus + research adicional. Discusión sobre frontera con `locale-mx` (que cubre reglas duras tú/ustedes/computadora) — el nuevo va un nivel más profundo: qué palabra MX según target.

**Research key findings (subagent):**
- DEM (Colmex) tiene CC BY-NC-ND → NO podemos shipar glosas verbatim, sólo citar como oracle
- DM (Academia Mexicana de la Lengua) está paywall → mismo approach
- 33,000 entradas en DEM pero la mayoría NO tienen marca regional → curaduría manual obligatoria
- Recomendación: 7 zonas dialectales (NO 5) — Yucatán justifica zona separada con respaldo académico
- Riesgos identificados: licencia DEM, caricatura regional, clasismo encubierto, decay de slang GenZ, sesgo CDMX en fuentes

**Construido:**
- Skill `mexicanismos-mx` v0.1 en `~/sistemia-skills-mx/skills/mexicanismos-mx/`:
  - `SKILL.md` — workflow + decisión multi-zona + frontera con locale-mx + DEM licensing claro + paso 5 cita académica
  - `README.md`
  - `data/regiones.json` — 7 zonas (Lope Blanch adaptado + Yucatán separado) + casos multi-zona (regio en CDMX, chilango con padres yucatecos, etc.)
  - `data/mexicanismos.json` — 110 palabras curadas por Sistemia, schema con region/registro/generación/NSE/dem_url/last_validated
  - `data/falsos_amigos.json` — 50 palabras: 13 intra-MX (chichí, chaqueta, morro, padre, papa, bolillo, jale, pisto, etc.) + 7 cross-país (popote, tuna, raza, coger, concha, ahorita, pedir el favor)
  - `data/registro_clasismo.json` — guía editorial NO prohibitiva sobre carga social (naco/fresa, racialización, género/servicio, regional burla, vulgares usables). Anclado en Federico Navarrete "Alfabeto del racismo mexicano"
  - `data/genz_2026.json` — 25 entries de slang juvenil con decay_risk + last_validated (gpi, funar, x, brainrot, aesthetic, delulu, etc.)
  - `examples/landing-dental-regio-vs-cdmx.md` — caso end-to-end mostrando adaptación regional + caricatura riesgosa

**Decisiones editoriales clave:**
- DEM como oracle, NO fuente. Curaduría propia con definiciones nuestras + link a DEM para autoridad académica
- Frontera explícita con locale-mx (reglas duras vs decisión regional)
- Yucatán zona separada (mare, bomba, chichí=abuela) con flag de "no folklorizar"
- Carga clasista NO como lista prohibitiva — como guía CUÁNDO sí/no
- Slang Gen Z marcado con decay_risk para advertir caducidad <12 meses

**Agregado al catálogo eltianguis:**
- Slug `mexicanismos-mx` · type skill · status live · featured true · mxLocal true
- Categoría mx-latam · tags [español, regionalismos, modismos, Monterrey, CDMX, Yucatán, Guadalajara, clasismo, Gen Z, MX-local]
- paidUpgrade → WhatsApp Sistemia para revisión humana + 3-5 variantes A/B

**Deploy:** OK · página live en `https://eltianguis.sistemia.mx/s/mexicanismos-mx/` (HTTP 200).

**Actualizado en repo skills:**
- `~/sistemia-skills-mx/MARKETPLACE.md` — skill #7 nuevo (mexicanismos-mx), renumerados 8-11
- `~/sistemia-skills-mx/CLAUDE.md` — estado (skill #13)

**Pendiente (siguiente sesión):**
- Push del repo `lahh1986/sistemia-skills-mx` con mexicanismos-mx
- Push de `lahh1986/eltianguis` con catálogo actualizado
- Re-validar `genz_2026.json` en junio 2027 (decay alto)
- Considerar v1.1: agregar zonas con curaduría más fina (Veracruz N/S, costa vs sierra Oaxaca)
- Considerar sub-skill `mexicanismos-mx-detector`: dado texto cualquiera, probabilidad de zona

---

## 2026-06-10 (tarde) — Skill `payments-ar` agregado al catálogo

**Trigger:** Después de lanzar `payments-mx` por la mañana, decidimos continuar la serie `payments-{cc}` LATAM. Argentina por costo/beneficio (Mercado Pago SDK reusable + cuotas culturales únicas + cepo cambiario + 5 días post-derogación Ahora 12).

**Construido:**
- Skill `payments-ar` v0.1 en `~/sistemia-skills-mx/skills/payments-ar/`:
  - `SKILL.md` — workflow + árbol de decisión específico AR (vertical + cuotas + bancarización + geografía + cepo) + cheat sheet + estrategia de cuotas post-Ahora 12 + sección cepo/USD
  - `README.md`
  - `data/gateways.json` — 7 gateways (Mercado Pago AR con 4 planes de acreditación, Decidir/Prisma con categorías BCRA, dLocal, MODO, PayU, Ualá Bis, Naranja X Toque)
  - `data/methods.json` — 14 métodos (tarjeta, débito, cuotas, QR interoperable/Transferencia 3.0, Rapipago, Pago Fácil, saldo MP, MODO, Mercado Crédito, Naranja Plan Z, Ualá, Binance Pay, USDT P2P, Wibond/WIPEI BNPL)
  - `examples/ecommerce-electro-cuotas.md` — caso end-to-end electro AR con cuotas modeladas como costo del merchant

**Decisiones técnicas clave del skill:**
- Mercado Pago Marketplace API es el único stack serio para marketplace en AR
- Plan de acreditación MP: default 6.29% inmediato, recomendar 14d (3.49%) o 35d (1.49%) según runway
- Decidir débito al 0.80% es el ganador para SaaS B2B y gastro físico
- dLocal Pay-outs es la única opción legal de USD payout con cepo
- Ahora 12 DEROGADO junio 2026 — modelar cuotas como costo (CFT 5.39% a 22.22% según plazo)
- Estrategia híbrida de cuotas: absorber 3 cuotas merchant, trasladar 12 cuotas cliente
- Naranja Plan Z absorbe el CFT, no el merchant — upside puro para electro/indumentaria
- USDT/Binance Pay sólo para freelance cross-border, no para retail B2C

**Agregado al catálogo eltianguis:**
- Slug `payments-ar` · type skill · status live · featured true · mxLocal **false** (es AR-local)
- Categoría mx-latam · tags [pagos, gateway, Mercado Pago, Decidir, dLocal, MODO, cuotas, Ahora 12, cepo, Argentina, AR-local, fintech]
- paidUpgrade → WhatsApp Sistemia para cableado + estrategia de cuotas

**Deploy:** OK · página live en `https://eltianguis.sistemia.mx/s/payments-ar/` (HTTP 200). Build 32 → 34 páginas, deploy 1s.

**Actualizado en repo skills:**
- `~/sistemia-skills-mx/MARKETPLACE.md` — skill #7 nuevo (payments-ar), renumerados 8-10
- `~/sistemia-skills-mx/CLAUDE.md` — estado del proyecto (skill #12)

**NO se mandó broadcast a suscriptores** — acabamos de mandar uno por la mañana con payments-mx. Política: batch semanal en lugar de un correo por skill, evitar fatiga. Próximo boletín agruparía AR + lo que venga.

**Pendiente (siguiente sesión):**
- Push del repo `lahh1986/sistemia-skills-mx` con AR + actualizaciones MX
- Push de `lahh1986/eltianguis` con catálogo actualizado
- Decidir cuál sigue (Brasil, Colombia, Chile, Perú) — esperar 24-48h al feedback de los grupos de FB sobre payments-mx
- Backfill catálogo eltianguis con skills sat-mx (live, no anunciado) + contador-pyme-mx + telecom-isp-mx que ya viven en el repo

---

## 2026-06-10 — Skill `payments-mx` agregado al catálogo

**Trigger:** Discusión sobre `eltianguis.sistemia.mx` y qué skills LATAM/ES tienen sentido fuera de México-only. Identificamos serie `payments-{cc}` país por país (cada país con stack único: PIX BR, PSE CO, Yape PE, WebPay CL, Bizum ES, Pago Móvil VE, SINPE CR, Yappy PA, Chivo SV…). Primer skill de la serie: `payments-mx`.

**Construido (misma sesión):**
- Skill `payments-mx` v0.1 en `~/sistemia-skills-mx/skills/payments-mx/`:
  - `SKILL.md` (266L) — triggers + workflow + árbol de decisión + cheat sheet + marco regulatorio
  - `README.md` (118L)
  - `data/gateways.json` — 5 gateways (Conekta, Mercado Pago, Stripe MX, Openpay, Clip) con fees, payout, marketplace, gotchas
  - `data/methods.json` — 11 métodos (tarjeta, SPEI, OXXO, CoDi, DiMo, saldo MP, Apple/Google Pay, Kueski, Aplazo, Atrato, CLABE) con adopción + recomendaciones por vertical
  - `examples/eltianguis-marketplace.md` — caso end-to-end de marketplace B2C
- Datos verificados al `2026-06-10` con investigación dedicada (subagent) contra páginas oficiales de pricing + AMVO + Banxico + GlobeNewswire MX BNPL Report 2026.

**Decisiones técnicas clave del skill:**
- MP Marketplace API recomendado para eltianguis (split nativo + OXXO single-stack)
- Stripe Connect para cross-border o sellers internacionales
- Conekta gana SPEI flat $12.50 (B2B alto ticket) y mejor fee OXXO (2.6% + $3)
- Openpay gana tarjeta nacional (2.9% + $2.50)
- Clip es card-only sin OXXO/SPEI online
- CoDi/DiMo se ignoran 2026 (esperar a Mundial)
- Conekta primer payout T+10 días (gotcha de cash flow)

**Agregado al catálogo:**
- Slug `payments-mx` · type skill · status live · featured true · mxLocal true
- Categoría mx-latam · tags [pagos, gateway, Mercado Pago, Stripe, Conekta, OXXO, SPEI, marketplace, MX-local, fintech]
- Tagline: "Qué gateway y métodos de pago usar en México, sin perder media tarde leyendo páginas de pricing."
- paidUpgrade → WhatsApp Sistemia para cableado llave en mano

**Deploy:** OK · página live en `https://eltianguis.sistemia.mx/s/payments-mx/` (HTTP 200). Build 32 páginas en 945ms. Preview `https://b539b1a9.sistemia-tianguis.pages.dev`.

**Actualizado en repo skills:**
- `~/sistemia-skills-mx/MARKETPLACE.md` — skill #6 nuevo, renumerados 7-9
- `~/sistemia-skills-mx/CLAUDE.md` — estado del proyecto (skills #8-#11)
- Memoria personal `project_payments_mx_skill.md` + entry en `MEMORY.md`

**Pendiente (siguiente sesión):**
- Mandar boletín #1 a suscriptores activos vía admin panel `/admin` (draft listo, esperando aprobación de Luis)
- Backfill skills #8 (sat-mx ya existe pero no se anunció), #9 (contador-pyme-mx), #10 (telecom-isp-mx) al catálogo si aún no están
- Push del repo `lahh1986/sistemia-skills-mx` con el skill nuevo
- Push de `lahh1986/eltianguis` con catálogo actualizado

---

## 2026-06-07 — Skill `sat-mx` agregado al catálogo

**Trigger:** Post de Guillermo Rodolfo Solis Sansores en grupo "Claude Code en Español" pidiendo "una repo que sí funcione para la descarga de la Constancia de Situación Fiscal y la Opinión de Cumplimiento". Luis Gonzalez respondió en thread con los dos repos de phpcfdi (`csf-sat-scraper` y `opinion-cumplimiento-sat-scraper`).

**Análisis de los repos referenciados:**
- `phpcfdi/csf-sat-scraper` — PHP · MIT · 6★ · último push 2026-01-22 · mantenido
- `phpcfdi/opinion-cumplimiento-sat-scraper` — PHP · MIT · 6★ · último push 2026-04-06 · último release corrigió cambio del portal SAT
- Inputs requeridos: RFC + CIEC + resolvedor de captcha (consola o servicio pagado)
- phpcfdi tiene reputación sólida en comunidad MX para temas SAT/CFDI

**Decisión:** No reimplementar — orquestar. Reescribir scrapers en TS/Python nos heredaría la pelea recurrente con el SAT. phpcfdi ya la ganó; nosotros nos sumamos como skill que llama sus librerías + agrega value (parseo del PDF a datos estructurados).

**Agregado al catálogo:**
- Slug `sat-mx` · type skill · status planned · featured true · mxLocal true
- Categoría mx-latam · tags [SAT, Constancia, Opinión Cumplimiento, MX-local, fiscal, PyME]
- Tagline: "Bájate tu Constancia de Situación Fiscal y Opinión de Cumplimiento sin entrar al portal del SAT."

**Deploy:** OK · página live en `https://eltianguis.sistemia.mx/s/sat-mx` (HTTP 200).

**Construido (misma sesión):**
- Skill `sat-mx` v0.1 funcional en `~/sistemia-skills-mx/skills/sat-mx/`:
  - `SKILL.md` (6.5KB) — instrucciones a Claude, flujo de uso, errores comunes
  - `README.md` (3.2KB) — human-facing con créditos a phpcfdi
  - `composer.json` + `composer.lock` (versiones pineadas)
  - `scripts/setup.sh` — detecta OS, verifica PHP/Composer/pdftotext/python3, instala lo que falta
  - `scripts/descargar_csf.php` — runner Constancia (credenciales por env var, soporta console + anticaptcha)
  - `scripts/descargar_opinion.php` — runner Opinión
  - `scripts/parse_pdf.py` — detecta tipo de PDF, extrae a JSON (RFC, régimen, domicilio, sentido, etc.)
  - `examples/ejemplo_uso.md` — flujo conversacional ejemplo
- Validaciones: PHP syntax OK (php -l), autoload OK (las 3 clases phpcfdi cargan), error paths OK
- `vendor/` agregado a `.gitignore`

**Status del catálogo:** `sat-mx` cambió de `planned` a `live` (sin status field) con repo + installPath + readmePath. Deploy CF Pages OK.

**Pendiente (siguiente sesión):**
- Test E2E con credenciales reales (login SAT + captcha + descarga + parseo)
- Ajustar regexes de `parse_pdf.py` después de ver un PDF real del SAT
- Push del repo `lahh1986/sistemia-skills-mx` con el skill nuevo
- Contestar posts de Facebook (Oscar + Guillermo) ahora que el skill es real, no planned

---

## 2026-05-29 — Scaffold inicial (v0.1)

**Decisión estratégica:**
Luis identificó hueco en el mercado: 3 grupos de Facebook "Claude Code en Español/México" suman 177K+ usuarios y NO existe portal de skills en español. Idea original "Focus MX" para el nombre se descartó (ya es producto de focus groups). Nombre elegido: **El Tianguis** — metáfora MX nativa, escalable (mañana puede ser tianguis de agentes/MCPs, no solo skills).

**Decisiones de modelo:**
- 100% gratis fase 1 (anti-Claw Mart). Network effect primero, monetizar fase 2.
- Cero storage propio: catálogo JSON apunta a repos GitHub de autores.
- Diferenciador real = categoría **MX/Latam** (CFDI, SAT, Mercado Pago, WhatsApp MX).
- Subdomain `eltianguis.sistemia.mx` para probar antes de comprar dominio.

**Stack:**
Astro 5 + Tailwind 4 + Svelte 5 (heredado de Trust). Tipografías Fraunces + Geist (Trust). Paleta brand terracota mexicano `#9d422a` + añil + nopal (Focus MX). Neutros editorial canvas warm (Trust).

**Archivos creados:**
```
package.json, astro.config.mjs, tsconfig.json, .gitignore
public/favicon.svg, public/robots.txt
src/styles/global.css (tokens + utilities)
src/layouts/Base.astro
src/components/{Header, Footer, Hero, CategoryGrid, SkillCard}.astro
src/data/{categories.ts, skills.ts, skills.json}
src/pages/{index.astro, c/[slug].astro, s/[slug].astro, publica.astro}
CLAUDE.md, CHANGELOG.md
```

**Catálogo seed (6 skills):**
1. **focus-group-mx** (live, MX-local, featured) — flagship, ya existe en `~/sistemia-skills-mx`
2. cfdi-validator (planned, MX-local)
3. whatsapp-mx-outreach (planned, MX-local, featured)
4. code-review-es (planned)
5. seo-local-mx (planned, MX-local)
6. memoria-personal (planned)

**Categorías (8):**
mx-latam (featured), programacion, marketing, ventas, productividad, investigacion, contenido, soporte.

**Páginas:**
- `/` — Hero + StatsStrip + Categorías + Destacados + MX/Latam + Recién llegados + CTA publica
- `/c/[slug]` — listado por categoría con count editorial
- `/s/[slug]` — detalle de skill con install path + GitHub link
- `/publica` — 3 pasos para subir skill + plantilla JSON + qué cuenta como skill

**Inspiración UX:**
Análisis de shopclawmart.com (Claw Mart): hero + social proof strip + categorías + cards con autor/rating/sold-count. Adaptado a contexto gratis/curado, sin precios ni counters falsos al inicio.

**Pendiente al cerrar sesión:**
1. `npm install` + verificar `npm run dev` arranca limpio
2. Crear CF Pages project `sistemia-tianguis` + bind `eltianguis.sistemia.mx`
3. Primer deploy
4. Outreach a 3 grupos de Facebook (149K + 27K + 1.3K usuarios)
5. Crear repo público `lahh1986/eltianguis` en GitHub para habilitar PRs
