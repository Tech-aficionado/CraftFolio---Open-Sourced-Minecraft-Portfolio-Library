import { useState } from "react";
import { usePortfolio } from "../PortfolioContext";
import PixelAvatar from "./PixelAvatar";
import Reveal from "./Reveal";
import VoxelWorld from "./VoxelWorldLazy";
import { useTheme } from "../theme/ThemeContext";

export default function About() {
  const { profile, options } = usePortfolio();
  const [expanded, setExpanded] = useState(false);
  const { isNight } = useTheme();

  return (
    <section id="about" className="relative overflow-hidden bg-night py-20">
      {options.enable3D && (
        <VoxelWorld variant="overworld" night={isNight} parallax={0.4} className="opacity-60" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-night/55" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="section-label mb-8">About Me</h2>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto,1fr]">
          {/* Framed avatar in a grassy plot */}
          <Reveal>
            <div className="mc-panel mx-auto w-56 p-3">
              <div className="relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b from-sky-700/40 to-grass-dark">
                <div className="mc-dirt absolute inset-x-0 bottom-0 h-10 border-t-4 border-grass" />
                <PixelAvatar className="relative z-10 mb-2 h-48 w-auto" />
                {/* torches */}
                <span className="absolute bottom-2 left-2 text-xl animate-glow">🕯️</span>
                <span className="absolute bottom-2 right-2 text-xl animate-glow [animation-delay:0.6s]">🕯️</span>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal delay={0.15}>
            <div className="mc-panel p-6">
              <p className="text-2xl leading-relaxed text-stone-100">
                {profile.about}
              </p>
              {expanded && (
                <p className="mt-4 text-xl leading-relaxed text-stone-300">
                  {profile.aboutExtended}
                </p>
              )}
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mc-btn mc-btn-dark mt-6"
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
