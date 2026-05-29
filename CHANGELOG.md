# Changelog — El Tianguis

Detalle por sesión. Headline más reciente vive en `CLAUDE.md` §11.

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
