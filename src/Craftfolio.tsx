import { useEffect, useMemo } from "react";
import "./index.css";
import type { DeepPartial, PortfolioData, PortfolioOptions, SectionKey } from "./types";
import { mergeData, mergeOptions } from "./defaultData";
import { PortfolioProvider } from "./PortfolioContext";
import { ThemeProvider } from "./theme/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";

function useGoogleFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector('link[data-craftfolio-fonts="true"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    link.dataset.craftfolioFonts = "true";
    document.head.appendChild(link);
  }, []);
}

const SECTIONS: Record<SectionKey, () => JSX.Element> = {
  hero: Hero,
  about: About,
  projects: Projects,
  skills: Skills,
  experience: Experience,
  contact: Contact,
};

export type CraftfolioProps = {
  /** Your content. Any omitted field falls back to the built-in defaults. */
  data?: DeepPartial<PortfolioData>;
  /** Behaviour + rendering options. */
  options?: Partial<PortfolioOptions>;
  /** Extra classes on the root wrapper. */
  className?: string;
};

/**
 * Craftfolio — a full-page Minecraft-themed portfolio. Drop it into any React app:
 *
 * ```tsx
 * import { Craftfolio } from "craftfolio";
 * import "craftfolio/styles.css";
 *
 * export default () => <Craftfolio data={myData} />;
 * ```
 */
export default function Craftfolio({
  data,
  options,
  className = "",
}: CraftfolioProps) {
  useGoogleFonts();

  const merged = useMemo(() => mergeData(data), [data]);
  const opts = useMemo(() => mergeOptions(options), [options]);

  const value = useMemo(() => ({ ...merged, options: opts }), [merged, opts]);

  return (
    <ThemeProvider defaultTheme={opts.defaultTheme}>
      <PortfolioProvider value={value}>
        <div className={`craftfolio min-h-screen bg-night font-mc text-stone-100 ${className}`}>
          <Navbar />
          <main>
            {opts.sections.map((key) => {
              const Section = SECTIONS[key];
              return Section ? <Section key={key} /> : null;
            })}
          </main>
        </div>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
