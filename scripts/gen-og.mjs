#!/usr/bin/env node
// Genera OG images sin satori — SVG → PNG directo con resvg.
// Trade-off: layout estático en código vs runtime. Suficiente para fase 1.
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const TERRACOTA = "#9d422a";
const TERRACOTA_DEEP = "#6b2d1c";
const ARENA = "#f4ead8";
const CANVAS = "#FBF8F3";
const CANVAS_WARM = "#F6EFE3";
const INK = "#1A1816";
const INK_MUTED = "#4F4A43";
const INK_SOFT = "#6B6660";
const ANIL = "#405aa9";
const NOPAL = "#4c6707";

const FRAUNCES = resolve(ROOT, "public/fonts/Fraunces.ttf");
const INTER = resolve(ROOT, "public/fonts/Inter.ttf");

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function homeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="blob1" cx="0%" cy="0%" r="55%">
      <stop offset="0%" stop-color="${TERRACOTA}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${TERRACOTA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blob2" cx="100%" cy="100%" r="50%">
      <stop offset="0%" stop-color="${ANIL}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ANIL}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CANVAS}"/>
  <rect width="1200" height="630" fill="url(#blob1)"/>
  <rect width="1200" height="630" fill="url(#blob2)"/>

  <g transform="translate(80,90)">
    <text font-family="Fraunces" font-size="40" font-weight="600" fill="${INK}" letter-spacing="-0.02em">El Tianguis</text>
    <text x="252" y="-2" font-family="Inter" font-size="16" font-weight="500" fill="${INK_SOFT}" letter-spacing="2.5">POR SISTEMIA</text>
  </g>

  <g transform="translate(80,280)">
    <text font-family="Fraunces" font-size="86" font-weight="600" fill="${INK}" letter-spacing="-0.025em">
      <tspan x="0" dy="0">El primer tianguis</tspan>
      <tspan x="0" dy="92">de skills para</tspan>
      <tspan x="0" dy="92">Claude Code.</tspan>
    </text>
  </g>

  <g transform="translate(80,570)">
    <text font-family="Inter" font-size="20" font-weight="500" fill="${TERRACOTA}" letter-spacing="2.5">EN ESPAÑOL · MX &amp; LATAM</text>
  </g>
</svg>`;
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

function skillSvg(skill) {
  const typeColors = {
    skill: INK,
    agente: ANIL,
    mcp: NOPAL,
    comando: "#6b2d8f",
    hook: "#b8860b",
    bundle: TERRACOTA_DEEP,
  };
  const tc = typeColors[skill.type] ?? INK;
  const nameLines = wrapText(skill.name, 22);
  const taglineLines = wrapText(skill.tagline, 64);

  const nameSize = nameLines.length > 1 ? 64 : 76;
  const nameSpan = nameLines.map((l, i) => `<tspan x="0" dy="${i === 0 ? 0 : nameSize * 1.0}">${escapeXml(l)}</tspan>`).join("");
  const taglineSpan = taglineLines
    .slice(0, 3)
    .map((l, i) => `<tspan x="0" dy="${i === 0 ? 0 : 32}">${escapeXml(l)}</tspan>`)
    .join("");

  let pillX = 0;
  const pills = [];
  const addPill = (text, color, w = 100) => {
    pills.push(`<rect x="${pillX}" y="0" width="${w}" height="32" rx="16" fill="none" stroke="${color}" stroke-width="1.5"/>
<text x="${pillX + w / 2}" y="21" font-family="Inter" font-size="13" font-weight="600" fill="${color}" text-anchor="middle" letter-spacing="2">${escapeXml(text)}</text>`);
    pillX += w + 10;
  };
  addPill(skill.type.toUpperCase(), tc, 100);
  if (skill.mxLocal) addPill("MX-LOCAL", TERRACOTA, 110);
  if (skill.verified) addPill("VERIFICADO", NOPAL, 120);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="blob1" cx="100%" cy="0%" r="55%">
      <stop offset="0%" stop-color="${TERRACOTA}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${TERRACOTA}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CANVAS}"/>
  <rect width="1200" height="630" fill="url(#blob1)"/>

  <g transform="translate(72,80)">
    <text font-family="Fraunces" font-size="32" font-weight="600" fill="${INK}" letter-spacing="-0.02em">El Tianguis</text>
    <text x="200" y="-2" font-family="Inter" font-size="14" font-weight="500" fill="${INK_SOFT}" letter-spacing="2">POR SISTEMIA</text>
  </g>

  <g transform="translate(72,290)">
    ${pills.join("")}
  </g>

  <g transform="translate(72,360)">
    <text font-family="Fraunces" font-size="${nameSize}" font-weight="600" fill="${INK}" letter-spacing="-0.025em">${nameSpan}</text>
  </g>

  <g transform="translate(72,${480 + (nameLines.length - 1) * nameSize * 1.0})">
    <text font-family="Inter" font-size="22" font-weight="400" fill="${INK_MUTED}">${taglineSpan}</text>
  </g>

  <g transform="translate(72,590)">
    <text font-family="Inter" font-size="14" font-weight="500" fill="${INK_SOFT}" letter-spacing="0.5">por ${escapeXml(skill.author)} · eltianguis.sistemia.mx</text>
  </g>
</svg>`;
}

async function render(svg, outPath) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      fontFiles: [FRAUNCES, INTER],
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
    },
  });
  const png = resvg.render().asPng();
  await writeFile(outPath, png);
  console.log(`  ✓ ${outPath.replace(ROOT + "/", "")} (${(png.length / 1024).toFixed(1)} KB)`);
}

function guideSvg(guide) {
  const titleLines = wrapText(guide.title, 28);
  const titleSize = titleLines.length >= 3 ? 60 : titleLines.length === 2 ? 68 : 76;
  const titleSpan = titleLines
    .slice(0, 3)
    .map((l, i) => `<tspan x="0" dy="${i === 0 ? 0 : titleSize * 1.0}">${escapeXml(l)}</tspan>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="blob1" cx="0%" cy="100%" r="55%">
      <stop offset="0%" stop-color="${ANIL}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ANIL}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blob2" cx="100%" cy="0%" r="50%">
      <stop offset="0%" stop-color="${TERRACOTA}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${TERRACOTA}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CANVAS}"/>
  <rect width="1200" height="630" fill="url(#blob1)"/>
  <rect width="1200" height="630" fill="url(#blob2)"/>

  <g transform="translate(80,90)">
    <text font-family="Fraunces" font-size="32" font-weight="600" fill="${INK}" letter-spacing="-0.02em">El Tianguis</text>
    <text x="200" y="-2" font-family="Inter" font-size="14" font-weight="500" fill="${INK_SOFT}" letter-spacing="2">POR SISTEMIA</text>
  </g>

  <g transform="translate(80,260)">
    <text font-family="Inter" font-size="18" font-weight="600" fill="${TERRACOTA}" letter-spacing="2.5">GUÍA · ${escapeXml(guide.eyebrow.toUpperCase())}</text>
  </g>

  <g transform="translate(80,320)">
    <text font-family="Fraunces" font-size="${titleSize}" font-weight="600" fill="${INK}" letter-spacing="-0.025em">${titleSpan}</text>
  </g>

  <g transform="translate(80,590)">
    <text font-family="Inter" font-size="16" font-weight="500" fill="${INK_SOFT}" letter-spacing="0.5">${escapeXml(guide.readMinutes)} min de lectura · eltianguis.sistemia.mx/guia</text>
  </g>
</svg>`;
}

const outDir = resolve(ROOT, "public/og");
await mkdir(outDir, { recursive: true });

console.log("Generating OG images…");
await render(homeSvg(), resolve(outDir, "default.png"));

const skillsRaw = await readFile(resolve(ROOT, "src/data/skills.json"), "utf-8");
const skills = JSON.parse(skillsRaw);
for (const s of skills) {
  if (s.status === "planned") continue;
  await render(skillSvg(s), resolve(outDir, `${s.slug}.png`));
}

const guidesRaw = await readFile(resolve(ROOT, "src/data/guides.json"), "utf-8");
const guides = JSON.parse(guidesRaw);
for (const g of guides) {
  await render(guideSvg(g), resolve(outDir, `guia-${g.slug}.png`));
}

console.log("Done.");
