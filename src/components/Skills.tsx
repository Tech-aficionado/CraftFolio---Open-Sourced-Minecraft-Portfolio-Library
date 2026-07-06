import { usePortfolio } from "../PortfolioContext";
import Reveal from "./Reveal";
import Cube3D from "./Cube3D";

function SkillBlock({
  name,
  colors,
  icon,
}: {
  name: string;
  colors: [string, string];
  icon: string;
}) {
  const [top, side] = colors;
  return (
    <div className="group flex flex-col items-center gap-3">
      <div className="mc-slot h-20 w-20 sm:h-24 sm:w-24">
        <div className="transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110">
          <Cube3D size={56} top={top} side={side} icon={icon} />
        </div>
      </div>
      <span className="font-pixel text-[0.5rem] uppercase tracking-wide text-stone-200">
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  const { skills, hotbar } = usePortfolio();
  return (
    <section id="skills" className="relative overflow-hidden bg-night py-20">
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="section-label mb-8">Skills</h2>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Inventory window */}
          <div className="mc-stone mx-auto max-w-3xl border-4 border-black/50 p-5 shadow-2xl">
            <div className="mc-panel bg-stone-light/10 p-6">
              <div className="grid grid-cols-3 gap-5 sm:grid-cols-5">
                {skills.map((s) => (
                  <SkillBlock key={s.name} {...s} />
                ))}
              </div>
            </div>

            {/* Hotbar */}
            <div className="mt-5 flex flex-wrap justify-center gap-1">
              {hotbar.map((item, i) => (
                <div key={i} className="mc-slot relative h-11 w-11 text-lg">
                  <span aria-hidden>{item.icon}</span>
                  {item.count != null && (
                    <span className="absolute bottom-0 right-1 font-pixel text-[0.5rem] text-white text-shadow-mc">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
