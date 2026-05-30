import raw from "./guides.json";

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  author: string;
  keywords: string[];
  relatedSkills: string[];
  eyebrow: string;
}

export const guides: Guide[] = raw as Guide[];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

export const otherGuides = (slug: string) =>
  guides.filter((g) => g.slug !== slug);
