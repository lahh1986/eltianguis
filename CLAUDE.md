# El Tianguis — Skills de Claude Code para MX/Latam

> Portal/marketplace de skills, agentes y MCPs para Claude Code en español.
> Sub-marca de Sistemia. Vive en `eltianguis.sistemia.mx`.

---

## 1. Identidad

| Pieza | Valor |
|---|---|
| **Marca pública** | El Tianguis |
| **Attribution** | "por Sistemia" |
| **URL pública** | `https://eltianguis.sistemia.mx` (custom domain CF Pages, pendiente) |
| **Dev URL** | `sistemia-tianguis.pages.dev` (pendiente) |
| **Repo / dir** | `~/eltianguis/` |
| **CF Pages project** | `sistemia-tianguis` (pendiente crear) |

---

## 2. Visión

El primer portal de skills de Claude Code curado en español para devs de México y Latinoamérica. Origen: 150K+ usuarios en grupos de Facebook "Claude Code en Español" y "Claude Code México" sin un solo portal en su idioma — todos los recursos circulan en inglés.

**Diferenciación vs Claw Mart (referente principal):**
- 100% gratis siempre (network effect first, monetización fase 2)
- Categoría destacada **MX/Latam** = el foso (CFDI, SAT, Mercado Pago, WhatsApp MX, INEGI, CURP, OXXO)
- Curaduría > cantidad (anti-listing spam)
- Cero storage propio: catálogo JSON apunta a repos GitHub de cada autor
- Badge "Verificado" en vez de precios

---

## 3. Modelo

### Fase 1 — Gratis (actual)
- Catálogo abierto, contribuciones vía PR a `src/data/skills.json`
- Curaduría manual de Sistemia
- Badge "Verificado" para los que pasan curaduría manual + ejemplos funcionales
- Categoría MX/Latam con prioridad visual

### Fase 2 — Monetización (post-validación tráfico)
- Sponsored placements (no rankings algorítmicos)
- Tier "Verificado Plus" para creadores ($X/mes con benefits)
- Skills enterprise hechos a medida (cross-sell Sistemia services)
- Cursos / bootcamp (cross-sell Academia)

**Trust principle**: el ranking algorítmico nunca se vende (mismo principio que AI Pick en Trust).

---

## 4. Stack

| Pieza | Tech |
|---|---|
| Frontend | Astro 5 + Tailwind 4 + Svelte 5 |
| Hosting | Cloudflare Pages (`sistemia-tianguis` project, pendiente crear) |
| Backend | Estático puro · catálogo en `src/data/skills.json` (versionado en git) |
| Sin storage | Cada skill vive en su propio repo de GitHub |

### Diseño
- **Paleta brand**: terracota mexicano `#9d422a` (heredado de Focus MX) + añil `#405aa9` + nopal `#4c6707`
- **Neutros**: editorial Trust (`#1A1816` ink, `#FBF8F3` canvas, `#F6EFE3` canvas-warm)
- **Tipografía**: Fraunces (display, serif), Geist (sans), Geist Mono (mono/labels)
- **Vibe**: editorial mexicano premium + dev-friendly (anti-AI-slop, sin emojis sin razón)

---

## 5. Estructura

```
~/eltianguis/
├── CLAUDE.md                       ← este archivo
├── CHANGELOG.md
├── package.json
├── astro.config.mjs                ← site: eltianguis.sistemia.mx
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── styles/global.css           ← tokens + utilities
    ├── layouts/Base.astro
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── CategoryGrid.astro
    │   └── SkillCard.astro
    ├── data/
    │   ├── skills.json             ← catálogo (source of truth)
    │   ├── skills.ts               ← types + helpers
    │   └── categories.ts
    └── pages/
        ├── index.astro             ← home con destacados + MX/Latam + nuevos + CTA
        ├── c/[slug].astro          ← categoría
        ├── s/[slug].astro          ← detalle de skill
        └── publica.astro           ← cómo subir tu skill
```

---

## 6. Schema del catálogo

```ts
interface Skill {
  slug: string;              // identificador URL-safe
  name: string;
  tagline: string;           // 1 línea, vende el skill
  description: string;       // qué hace + para quién
  author: string;
  authorUrl: string | null;
  category: string;          // slug de Category
  tags: string[];
  repo: string | null;       // URL GitHub (null si planned)
  installPath: string | null;
  downloads: number;         // pendiente: pull desde GH stars/downloads
  stars: number;
  verified: boolean;         // curaduría manual
  mxLocal: boolean;          // bandera "skill MX-específico"
  featured: boolean;         // home destacados
  addedAt: string;           // YYYY-MM-DD
  status?: "live" | "planned" | "wip";
}
```

---

## 7. Comandos npm

```bash
npm install              # primera vez
npm run dev              # localhost:4321
npm run build            # → ./dist
npm run preview
npm run deploy           # build + wrangler pages deploy
```

---

## 8. Voz / copy

- Español de México: tú, ustedes, vocabulario MX
- Sin anglicismos corporativos crudos ("killar", "landing", "pitch")
- OK: "skill", "MCP", "agente", "PR" — son términos técnicos universales
- Tono: directo, valor primero, anti-corporate-speak
- Sin emojis decorativos (regla global)
- "tianguis", "pasillo", "puesto" como metáforas vivas pero no forzadas

---

## 9. Decisiones tomadas

| Decisión | Razón |
|---|---|
| Subdomain `eltianguis.sistemia.mx` | Aprovecha autoridad de sistemia.mx, no comprar dominio antes de validar |
| Astro estático sin DB | Catálogo en JSON · cero costo · contribuciones vía PR · audit trail en git |
| Cero hosting de skills | Skills viven en repos de los autores · evita responsabilidad legal + costo |
| Gratis total fase 1 | Network effect > monetización temprana · Claw Mart ya cobra |
| Categoría MX/Latam destacada | El moat real · nadie gringo va a construir CFDI/SAT |
| Sin emojis sin razón | Anti-AI-slop · regla global del workspace |
| No copiar marketplace pagado | LATAM payment friction + piratería + trust gap |

---

## 10. Status (snapshot 2026-05-29)

### ✅ Listo
- Scaffold completo Astro + Tailwind 4 + Svelte
- Sistema de diseño con tokens MX (terracota/añil/nopal) + tipografías editorial
- 4 páginas: home, categoría, skill detail, publica
- 6 skills seed en catálogo (1 live: focus-group-mx; 5 planned)
- 8 categorías con MX/Latam destacada

### ⏳ Pendiente directo (próxima sesión)
1. **`npm install` + verificar dev server arranca** localhost:4321
2. **Crear CF Pages project** `sistemia-tianguis` + bind custom domain `eltianguis.sistemia.mx`
3. **Deploy primera versión** y validar render en prod
4. **Outreach a los 3 grupos de Facebook** (149K + 27K + 1.3K = 177K usuarios potenciales)
5. **Repo público en GitHub** `lahh1986/eltianguis` para que PRs sean posibles

### 📌 Pendiente medio plazo
- Script de sync con GitHub API para auto-pull stars/downloads de cada repo
- Página `/buscar` con search client-side (Fuse.js o Pagefind)
- RSS feed de skills nuevos
- OG image dinámico por skill (CF Pages Function o Vercel OG)
- Stats reales del tianguis (X skills, X creadores, X descargas combinadas)
- Newsletter "Tianguis Semanal"
- Esquema de "stars" y reviews por skill

---

## 11. Último contexto

> Detalle por sesión vive en `CHANGELOG.md`. Aquí solo headline.

### 2026-05-29 — Scaffold inicial
Construcción completa de v0.1 en una sesión. Stack heredado de Trust (Astro/Tailwind/Svelte), sistema visual mezcla de Focus MX (terracota) + Trust (Fraunces editorial). 6 skills seed con focus-group-mx como flagship. Pendiente: deploy + outreach a grupos de Facebook.
