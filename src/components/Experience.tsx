import { motion } from "framer-motion";
import { usePortfolio } from "../PortfolioContext";
import Reveal from "./Reveal";
import Cube3D from "./Cube3D";

export default function Experience() {
  const { experiences } = usePortfolio();
  return (
    <section id="experience" className="relative overflow-hidden bg-panel py-20">
      {/* faint textured backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-20 grid-cracks" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="section-label mb-8">Experience</h2>
          </Reveal>

          <ul className="space-y-3">
            {experiences.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.1}>
                <li className="mc-panel flex items-start gap-4 p-4 transition-transform hover:translate-x-1">
                  <span className="mc-slot h-12 w-12 shrink-0 text-2xl">{e.icon}</span>
                  <div>
                    <h3 className="font-pixel text-[0.66rem] uppercase leading-snug text-white">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-lg text-stone-300">{e.detail}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Enchanting table */}
        <Reveal delay={0.2}>
          <div className="relative mx-auto flex h-80 w-full max-w-sm items-center justify-center">
            {/* glow */}
            <div className="absolute h-56 w-56 rounded-full bg-nether-light/20 blur-3xl animate-glow" />

            {/* spinning enchanted block above the table */}
            <motion.div
              className="absolute z-20 -top-2"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cube3D size={54} top="#a24bff" side="#3b0764" front="#7c3aed" spin />
            </motion.div>

            {/* floating book */}
            <motion.div
              className="relative z-10 mt-16 text-7xl"
              animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              📖
            </motion.div>

            {/* rune particles */}
            {["✦", "✧", "❈", "✺", "✦", "❋"].map((r, i) => (
              <motion.span
                key={i}
                className="absolute text-nether-light/80 text-sm"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 3) * 18}%`,
                }}
                animate={{ y: [0, -30], opacity: [0, 1, 0] }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {r}
              </motion.span>
            ))}

            {/* table base */}
            <div className="absolute bottom-6 h-24 w-40">
              <div className="mc-stone h-full w-full border-4 border-black/50" />
              <div
                className="absolute inset-x-3 top-2 h-6"
                style={{ background: "linear-gradient(#c0392b,#7b241c)" }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
