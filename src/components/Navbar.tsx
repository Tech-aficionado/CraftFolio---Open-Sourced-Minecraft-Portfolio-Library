import { useEffect, useState } from "react";
import { usePortfolio } from "../PortfolioContext";
import { useTheme } from "../theme/ThemeContext";
import PixelAvatar from "./PixelAvatar";

function ThemeToggle() {
  const { isNight, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="mc-btn mc-btn-dark !p-2 !text-base"
      aria-label={isNight ? "Switch to day" : "Switch to night"}
      title={isNight ? "Switch to day" : "Switch to night"}
    >
      <span className="transition-transform duration-300">
        {isNight ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

export default function Navbar() {
  const { profile, navLinks, options } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-night/90 backdrop-blur border-b-4 border-black/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="#top" className="mc-panel flex items-center gap-2 px-2.5 py-1.5">
          <span className="mc-slot h-7 w-7 shrink-0">
            <PixelAvatar headOnly className="h-6 w-6" />
          </span>
          <span className="font-pixel text-sm tracking-tight text-white text-shadow-mc sm:text-base">
            {profile.brand.slice(0, 6)}
            <span className="text-gold-light">{profile.brand.slice(6)}</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-pixel text-[0.62rem] uppercase tracking-wide text-stone-200 hover:text-gold-light transition-colors text-shadow-mc"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <span className="text-2xl animate-bob inline-block" aria-hidden>
              ⛏️
            </span>
          </li>
          {options.showThemeToggle && (
            <li>
              <ThemeToggle />
            </li>
          )}
        </ul>

        {/* Mobile cluster */}
        <div className="flex items-center gap-2 md:hidden">
          {options.showThemeToggle && <ThemeToggle />}
          <button
            onClick={() => setOpen((o) => !o)}
            className="mc-btn mc-btn-dark !p-2 !text-[0.6rem]"
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="mc-panel mx-4 mb-3 flex flex-col gap-3 p-4 md:hidden">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-pixel text-[0.7rem] uppercase tracking-wide text-stone-200 hover:text-gold-light"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
