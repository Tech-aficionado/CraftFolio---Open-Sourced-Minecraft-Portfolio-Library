import { motion } from "framer-motion";
import { usePortfolio } from "../PortfolioContext";
import HeartBar from "./HeartBar";
import VoxelWorld from "./VoxelWorldLazy";
import { useTheme } from "../theme/ThemeContext";

const STARS = Array.from({ length: 28 }).map((_, i) => ({
  left: (i * 53) % 100,
  top: (i * 29) % 60,
  size: (i % 3) + 1,
  delay: (i % 7) * 0.4,
}));

export default function Hero() {
  const { profile, stats, options } = usePortfolio();
  const { isNight } = useTheme();

  return (
    <section
      id="top"
      className={`relative min-h-screen overflow-hidden pt-24 transition-[filter] duration-500 ${
        isNight ? "bg-night-scene" : "bg-sky-scene"
      }`}
    >
      {/* Sky overlays behind the 3D terrain */}
      {isNight ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute bg-white animate-glow"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-[12%] top-[14%] h-4 w-24 bg-white/60 animate-float" />
          <div className="absolute right-[14%] top-[22%] h-4 w-20 bg-white/50 animate-float [animation-delay:1.5s]" />
          <div className="absolute left-[30%] top-[8%] h-3 w-16 bg-white/40 animate-float [animation-delay:2.4s]" />
        </div>
      )}

      {/* Live 3D voxel world */}
      {options.enable3D && <VoxelWorld variant="overworld" night={isNight} parallax={1} />}

      {/* Readability scrim: darkens lower-left where the text sits, fades toward the sky */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-night/85 via-night/25 to-transparent"
        aria-hidden
      />
      {/* Fade the terrain base into the section below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-night" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-24 lg:grid-cols-2">
        {/* Left: intro */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 font-pixel text-sm text-white text-shadow-mc"
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mc-heading text-5xl sm:text-6xl lg:text-7xl"
          >
            <span className="block text-white">{profile.firstName}</span>
            <span className="block text-gold-light">{profile.lastName}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-4"
          >
            <span className="mc-btn cursor-default !py-2 !text-[0.62rem]">
              {profile.role}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-5 max-w-md text-xl text-stone-100/90 text-shadow-mc"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <a href="#projects" className="mc-btn mc-btn-gold">
              Enter World ▶
            </a>
          </motion.div>

          <a
            href="#about"
            className="mt-10 inline-flex items-center gap-2 font-pixel text-[0.6rem] uppercase text-white/80 hover:text-white"
          >
            Scroll to explore
            <span className="animate-bob">▼</span>
          </a>
        </div>

        {/* Right: stats panel (the character now stands in the 3D world) */}
        <div className="relative flex flex-col items-center justify-center gap-6 lg:items-end">
          {/* Stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mc-panel w-full max-w-sm p-4"
          >
            <h3 className="mb-3 flex items-center gap-2 font-pixel text-[0.7rem] uppercase text-gold-light">
              <span aria-hidden>🏆</span> Stats Status
            </h3>
            <ul className="space-y-2">
              {stats.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-lg text-stone-100">
                    <span className="text-gold-light" aria-hidden>◆</span>
                    {s.label}: {s.value}
                  </span>
                  <HeartBar value={s.value} />
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
