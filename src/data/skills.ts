import raw from "./skills.json";

export interface Skill {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  author: string;
  authorUrl: string | null;
  category: string;
  tags: string[];
  repo: string | null;
  installPath: string | null;
  downloads: number;
  stars: number;
  verified: boolean;
  mxLocal: boolean;
  featured: boolean;
  addedAt: string;
  status?: "live" | "planned" | "wip";
}

export const skills: Skill[] = raw as Skill[];

export const liveSkills = () => skills.filter((s) => s.status !== "planned");

export const featuredSkills = () => skills.filter((s) => s.featured);

export const skillsByCategory = (slug: string) =>
  skills.filter((s) => s.category === slug);

export const getSkill = (slug: string) => skills.find((s) => s.slug === slug);

export const mxLocalSkills = () => skills.filter((s) => s.mxLocal);

export const newestSkills = (n = 6) =>
  [...skills]
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
    .slice(0, n);
