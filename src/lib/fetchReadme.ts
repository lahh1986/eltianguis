import { marked } from "marked";
import type { Skill } from "../data/skills";

const cache = new Map<string, { html: string; source: string } | null>();

marked.setOptions({
  gfm: true,
  breaks: false,
});

function rawUrl(skill: Skill): string | null {
  if (!skill.repo) return null;
  const repoSlug = skill.repo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const branch = skill.branch ?? "main";
  const path = skill.readmePath ?? "README.md";
  return `https://raw.githubusercontent.com/${repoSlug}/${branch}/${path}`;
}

export async function fetchReadme(skill: Skill): Promise<{ html: string; source: string } | null> {
  const url = rawUrl(skill);
  if (!url) return null;
  if (cache.has(url)) return cache.get(url)!;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      cache.set(url, null);
      return null;
    }
    const md = await res.text();
    const html = await marked.parse(md);
    const result = { html, source: url };
    cache.set(url, result);
    return result;
  } catch {
    cache.set(url, null);
    return null;
  }
}
