import type {
  DeepPartial,
  PortfolioData,
  PortfolioOptions,
} from "./types";

/**
 * Rich default content. Consumers override any subset of this via the
 * `data` prop; anything omitted falls back to these values.
 */
export const defaultData: PortfolioData = {
  profile: {
    name: "Mansha Verma",
    firstName: "Mansha",
    lastName: "Verma",
    role: "Software Engineer",
    brand: "MANSHACRAFT",
    tagline:
      "I build exceptional digital experiences with clean code and creative design.",
    about:
      "I'm a passionate developer who loves building beautiful, functional and user-friendly web experiences. Always exploring, always building.",
    aboutExtended:
      "From crafting pixel-perfect interfaces to architecting scalable systems, I treat every project like a new world to build. My toolkit spans the full stack, and my curiosity keeps the enchantment table glowing.",
    resumeUrl: "/resume.pdf",
    year: new Date().getFullYear(),
  },
  stats: [
    { label: "Code", value: 100 },
    { label: "Design", value: 95 },
    { label: "Creativity", value: 98 },
    { label: "Problem Solving", value: 96 },
  ],
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  projects: [
    {
      title: "Healthy Bharat",
      description: "A full-stack web app for health & wellness.",
      tags: ["React", "Node.js", "MongoDB"],
      href: "#",
      accent: "linear-gradient(135deg, #fb7185, #ec4899 45%, #dc2626)",
      emoji: "🏛️",
    },
    {
      title: "AI Verse",
      description: "AI tools directory & platform.",
      tags: ["Next.js", "TypeScript", "OpenAI"],
      href: "#",
      accent: "linear-gradient(135deg, #67e8f9, #0ea5e9 45%, #1d4ed8)",
      emoji: "💎",
    },
    {
      title: "Electricity Billing System",
      description: "A smart billing system for consumers.",
      tags: ["Java", "MySQL", "Swing"],
      href: "#",
      accent: "linear-gradient(135deg, #fcd34d, #f97316 45%, #92400e)",
      emoji: "🏠",
    },
  ],
  skills: [
    { name: "HTML", colors: ["#e5602b", "#a63c17"], icon: "🌐" },
    { name: "CSS", colors: ["#2e6ed6", "#1c4692"], icon: "🎨" },
    { name: "JavaScript", colors: ["#f0d43a", "#c9ab13"], icon: "⚡" },
    { name: "TypeScript", colors: ["#3178c6", "#1e4f85"], icon: "🔷" },
    { name: "React", colors: ["#61dafb", "#2ba3c4"], icon: "⚛️" },
    { name: "Next.js", colors: ["#e8e8e8", "#8a8a8a"], icon: "▲" },
    { name: "Node.js", colors: ["#6cc24a", "#3f7a29"], icon: "🟢" },
    { name: "Tailwind", colors: ["#38bdf8", "#1d7fb0"], icon: "🌊" },
    { name: "Git", colors: ["#f1502f", "#b3341c"], icon: "🔀" },
    { name: "Figma", colors: ["#a259ff", "#f24e1e"], icon: "🖌️" },
  ],
  hotbar: [
    { icon: "⚔️" },
    { icon: "⛏️" },
    { icon: "🪓" },
    { icon: "🥄" },
    { icon: "🌱", count: 9 },
    { icon: "🧱", count: 64 },
    { icon: "🪣" },
    { icon: "🕯️" },
    { icon: "💎", count: 12 },
  ],
  experiences: [
    { title: "Frontend Developer Intern", detail: "Built UI components and improved UX.", icon: "🗡️" },
    { title: "Meta Frontend Developer Certificate", detail: "Completed professional certification.", icon: "📜" },
    { title: "Research Paper Published", detail: "Explored AI in healthcare domain.", icon: "📄" },
    { title: "Open Source Contributor", detail: "Contributed to amazing projects.", icon: "🌿" },
  ],
  contactLinks: [
    { label: "github.com/mansha-verma", href: "https://github.com/mansha-verma", icon: "🐙" },
    { label: "linkedin.com/in/mansha-verma", href: "https://linkedin.com/in/mansha-verma", icon: "💼" },
    { label: "mansha.verma@gmail.com", href: "mailto:mansha.verma@gmail.com", icon: "✉️" },
    { label: "Download Resume", href: "/resume.pdf", icon: "📥" },
  ],
};

export const defaultOptions: PortfolioOptions = {
  defaultTheme: "day",
  enable3D: true,
  sections: ["hero", "about", "projects", "skills", "experience", "contact"],
  showThemeToggle: true,
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge a partial override onto a base object (arrays replace wholesale). */
export function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base;
  const out: Record<string, unknown> = Array.isArray(base)
    ? ([...(base as unknown[])] as unknown as Record<string, unknown>)
    : { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as object)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    if (o === undefined) continue;
    out[key] = isObject(b) && isObject(o) ? deepMerge(b, o as DeepPartial<typeof b>) : o;
  }
  return out as T;
}

export function mergeData(override?: DeepPartial<PortfolioData>): PortfolioData {
  return deepMerge(defaultData, override);
}

export function mergeOptions(override?: Partial<PortfolioOptions>): PortfolioOptions {
  return { ...defaultOptions, ...override };
}
