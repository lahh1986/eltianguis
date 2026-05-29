export interface Category {
  slug: string;
  name: string;
  description: string;
  emoji?: string;
  featured?: boolean;
}

export const categories: Category[] = [
  {
    slug: "mx-latam",
    name: "MX/Latam",
    description: "Skills hechos para realidades regionales: CFDI, SAT, Mercado Pago, WhatsApp MX, OXXO, CURP, INEGI.",
    featured: true,
  },
  {
    slug: "programacion",
    name: "Programación",
    description: "Loops de código, debugging, refactors, testing, code review en español.",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Investigación de audiencia, copy en español MX, SEO local, análisis competitivo.",
  },
  {
    slug: "ventas",
    name: "Ventas",
    description: "Outreach por WhatsApp, prospección, seguimiento, scripts de objeciones.",
  },
  {
    slug: "productividad",
    name: "Productividad",
    description: "Sistemas de memoria, organización, calendarios, recordatorios.",
  },
  {
    slug: "investigacion",
    name: "Investigación",
    description: "Síntesis de fuentes, análisis de mercado, focus groups, monitoreo.",
  },
  {
    slug: "contenido",
    name: "Contenido",
    description: "Generación de posts, guiones, podcasts, narración con TTS.",
  },
  {
    slug: "soporte",
    name: "Soporte",
    description: "Atención al cliente, FAQ automatizado, triage de tickets.",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
