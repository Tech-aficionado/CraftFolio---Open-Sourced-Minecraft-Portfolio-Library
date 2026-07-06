/* Public data contract for the Minecraft portfolio library. */

export type Stat = { label: string; value: number };
export type NavLink = { label: string; href: string };

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  /** any CSS background value (e.g. a linear-gradient) for the card art */
  accent: string;
  emoji: string;
};

export type Skill = {
  name: string;
  /** [top-face color, side-face color] for the 3D block */
  colors: [string, string];
  icon: string;
};

export type HotbarItem = { icon: string; count?: number | null };

export type Experience = { title: string; detail: string; icon: string };

export type ContactLink = { label: string; href: string; icon: string };

export type Profile = {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  brand: string;
  tagline: string;
  about: string;
  aboutExtended: string;
  resumeUrl: string;
  year: number;
};

export type PortfolioData = {
  profile: Profile;
  stats: Stat[];
  navLinks: NavLink[];
  projects: Project[];
  skills: Skill[];
  hotbar: HotbarItem[];
  experiences: Experience[];
  contactLinks: ContactLink[];
};

export type SectionKey =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export type Theme = "day" | "night";

export type PortfolioOptions = {
  /** initial day/night theme (default: "day") */
  defaultTheme: Theme;
  /** render the live WebGL voxel scenes (default: true) */
  enable3D: boolean;
  /** which sections to render and in what order */
  sections: SectionKey[];
  /** show the day/night toggle in the navbar (default: true) */
  showThemeToggle: boolean;
};

/** Recursive partial; arrays are replaced wholesale, not merged element-wise. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<unknown>
    ? T[K]
    : T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};
