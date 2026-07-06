import { useRef } from "react";
import { usePortfolio } from "../PortfolioContext";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

export default function Projects() {
  const { projects } = usePortfolio();
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="projects" className="relative bg-panel py-20 grid-cracks">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-label">Featured Projects</h2>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => scroll(-1)} className="mc-btn mc-btn-dark !p-3" aria-label="Previous">
                ◀
              </button>
              <button onClick={() => scroll(1)} className="mc-btn mc-btn-dark !p-3" aria-label="Next">
                ▶
              </button>
            </div>
          </div>
        </Reveal>

        <div className="relative flex items-center gap-3">
          <button
            onClick={() => scroll(-1)}
            className="mc-btn mc-btn-dark !p-3 self-center sm:hidden"
            aria-label="Previous"
          >
            ◀
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.1}
                className="min-w-[280px] max-w-[320px] flex-1 snap-start"
              >
                <Tilt className="h-full" max={9} pop={26}>
                  <article
                    data-card
                    className="mc-panel flex h-full flex-col p-3"
                  >
                    {/* "screenshot" */}
                    <div
                      className="relative flex h-40 items-center justify-center overflow-hidden border-4 border-black/40"
                      style={{ backgroundImage: p.accent }}
                    >
                      <span
                        className="text-6xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]"
                        style={{ transform: "translateZ(40px)" }}
                      >
                        {p.emoji}
                      </span>
                      <div className="absolute inset-0 grid-cracks opacity-30" />
                    </div>

                    <h3 className="mt-4 font-pixel text-[0.72rem] uppercase leading-snug text-gold-light">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-lg text-stone-200">
                      {p.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="border-2 border-black/40 bg-black/30 px-2 py-[2px] text-sm text-grass-light"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.href}
                      className="mc-btn mc-btn-gold mt-4 w-full !text-[0.58rem]"
                    >
                      View Project
                    </a>
                  </article>
                </Tilt>
              </Reveal>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="mc-btn mc-btn-dark !p-3 self-center sm:hidden"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
