import { motion } from "framer-motion";
import { usePortfolio } from "../PortfolioContext";
import PixelAvatar from "./PixelAvatar";
import Reveal from "./Reveal";
import VoxelWorld from "./VoxelWorldLazy";

export default function Contact() {
  const { contactLinks, profile, options } = usePortfolio();
  return (
    <section id="contact" className="relative overflow-hidden bg-nether-scene py-20">
      {options.enable3D && <VoxelWorld variant="nether" parallax={0.6} className="opacity-90" />}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-panel to-transparent" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-3">
        {/* Left: connect */}
        <div className="lg:col-span-1">
          <Reveal>
            <h2 className="section-label mb-4">Let's Connect</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-6 max-w-xs text-xl text-stone-200">
              Have a project in mind or just want to say hi? Send me a message
              through the portal!
            </p>
          </Reveal>
          <ul className="space-y-3">
            {contactLinks.map((c, i) => (
              <Reveal key={c.label} delay={0.15 + i * 0.08}>
                <li>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="mc-panel flex items-center gap-3 px-4 py-3 transition-colors hover:bg-nether/30"
                  >
                    <span className="text-xl" aria-hidden>
                      {c.icon}
                    </span>
                    <span className="truncate text-lg text-stone-100">{c.label}</span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Middle: nether portal */}
        <Reveal delay={0.2} className="lg:col-span-1">
          <div className="relative mx-auto flex h-80 w-56 items-end justify-center">
            {/* obsidian frame */}
            <div className="absolute inset-0 border-[14px] border-[#211a2b] bg-[#120a1c]" />
            {/* swirling portal */}
            <motion.div
              className="absolute inset-[14px] bg-gradient-to-b from-nether-light/70 via-nether/70 to-nether-dark/80"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundSize: "100% 200%",
              }}
            />
            <div className="absolute inset-[14px] opacity-40 grid-cracks" />
            {/* seated character silhouette */}
            <PixelAvatar className="relative z-10 mb-1 h-40 w-auto opacity-90" />
          </div>
        </Reveal>

        {/* Right: thank-you sign */}
        <Reveal delay={0.3} className="lg:col-span-1">
          <div
            className="mx-auto max-w-xs border-4 p-6 text-center"
            style={{
              background: "linear-gradient(#8a5a2b,#6b4423)",
              borderColor: "#a06a34 #4b2f16 #4b2f16 #a06a34",
              boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.35), inset 4px 4px 0 rgba(255,255,255,0.12)",
            }}
          >
            <h3 className="font-pixel text-sm uppercase leading-relaxed text-[#ffe9a0] text-shadow-mc">
              Thank You
              <br />
              For Visiting!
            </h3>
            <p className="mt-3 text-lg text-[#f3e4c6]">
              Keep building, keep exploring.
            </p>
            <div className="my-3 text-2xl">❤️</div>
            <p className="font-pixel text-[0.55rem] uppercase text-[#e6cfa0]">
              {profile.brand} © {profile.year}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
