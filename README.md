<div align="center">

# ⛏️ Craftfolio

### Turn your React app into a **Minecraft-themed developer portfolio** — with a live 3D voxel world — in one component.

[![npm version](https://img.shields.io/npm/v/craftfolio.svg?color=5b8731&label=npm&logo=npm)](https://www.npmjs.com/package/craftfolio)
[![npm downloads](https://img.shields.io/npm/dm/craftfolio.svg?color=5b8731)](https://www.npmjs.com/package/craftfolio)
[![CI](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/actions/workflows/ci.yml/badge.svg)](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/craftfolio?label=core%20gzip&color=f0a815)](https://bundlephobia.com/package/craftfolio)
[![license](https://img.shields.io/npm/l/craftfolio.svg?color=6a0dad)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-a24bff.svg)](./CONTRIBUTING.md)

Built with **React 18** · **Three.js** · **Framer Motion** · **TypeScript**

</div>

---

```tsx
import { Craftfolio } from "craftfolio";
import "craftfolio/styles.css";

export default () => <Craftfolio data={{ profile: { firstName: "Ada", lastName: "Lovelace" } }} />;
```

That's the whole integration. Feed it a data object, get a full-page portfolio: a sunset overworld hero with a **real WebGL voxel landscape**, an inventory of 3D skill blocks, a heart-bar stats panel, an enchanting-table experience timeline, and a Nether-portal contact section — plus a day/night toggle.

---

## Table of contents

- [Features](#-features)
- [Quick start](#-quick-start)
  - [Next.js (App Router)](#nextjs-app-router)
  - [Vite / CRA](#vite--cra)
- [The data prop](#-the-data-prop)
- [Options](#-options)
- [Theming & day/night](#-theming--daynight)
- [Exports & hooks](#-exports--hooks)
- [How it works](#-how-it-works)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Browser support](#-browser-support)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🧱 **One-component install** — render `<Craftfolio />`, pass your data, done.
- 🌍 **Live 3D voxel worlds** — procedurally generated terrain, a carved river with shimmering water, trees, drifting cloud blocks, and a voxel character standing on the ground. Not images — real Three.js.
- 🌗 **Day / night theme** — animated sunset ↔ moonlit sky, with soft directional shadows and a god-ray sun. Remembers the user's choice.
- 🎒 **Authentic Minecraft UI** — beveled panels, inventory slots, a hotbar, heart bars, and pixel fonts.
- 🧩 **100% data-driven** — every string, project, and skill comes from a typed `data` prop. Deep-merged over sensible defaults, so partial data just works.
- ⚡ **Tuned for performance** — instanced geometry, visibility-gated rendering, baked shadows, DPR + FPS caps, and a lazy-loaded 3D chunk.
- 🎛️ **Configurable** — toggle sections, reorder them, disable WebGL, pick the starting theme.
- 🛡️ **Won't break your app** — Tailwind preflight is disabled and all styles are scoped to `.craftfolio`.
- 🔤 **TypeScript-first** — full types shipped; fonts auto-injected.

---

## 🚀 Quick start

```bash
npm install craftfolio
# or: pnpm add craftfolio · yarn add craftfolio
```

`react` and `react-dom` (v18+) are peer dependencies. `three` and `framer-motion` install automatically.

### Next.js (App Router)

Craftfolio renders WebGL and uses browser APIs, so it must run on the client.

```tsx
// app/page.tsx
"use client";

import { Craftfolio } from "craftfolio";
import "craftfolio/styles.css";
import { portfolioData } from "./portfolio-data";

export default function Page() {
  return <Craftfolio data={portfolioData} />;
}
```

> Prefer a dedicated route (e.g. `/`) so the theme takes over the full page. If you keep other UI on the page, the styles stay scoped to Craftfolio and won't leak.

### Vite / CRA

```tsx
// src/App.tsx
import { Craftfolio } from "craftfolio";
import "craftfolio/styles.css";
import { portfolioData } from "./portfolio-data";

export default function App() {
  return <Craftfolio data={portfolioData} />;
}
```

---

## 📦 The `data` prop

Everything is optional — anything you omit falls back to the built-in example content (deep-merged). Here's the **complete** shape:

```tsx
import { Craftfolio, type PortfolioData } from "craftfolio";

const data: PortfolioData = {
  profile: {
    name: "Ada Lovelace",
    firstName: "Ada",
    lastName: "Lovelace",
    role: "Software Engineer",
    brand: "ADACRAFT",                 // shown in the navbar logo
    tagline: "I build the future, one block at a time.",
    about: "Full-stack developer who loves clean code and pixel art.",
    aboutExtended: "Longer bio revealed by the 'Read More' button.",
    resumeUrl: "/ada-resume.pdf",
    year: 2026,                          // footer copyright year
  },

  stats: [                               // rendered as heart bars (0–100)
    { label: "Code", value: 100 },
    { label: "Design", value: 92 },
  ],

  navLinks: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
  ],

  projects: [
    {
      title: "Analytical Engine",
      description: "The first general-purpose computer.",
      tags: ["Mechanical", "Math"],
      href: "https://example.com",
      accent: "linear-gradient(135deg, #a78bfa, #6d28d9)", // any CSS background
      emoji: "⚙️",
    },
  ],

  skills: [
    // colors: [top-face, side-face] for the 3D block
    { name: "TypeScript", colors: ["#3178c6", "#1e4f85"], icon: "🔷" },
    { name: "React", colors: ["#61dafb", "#2ba3c4"], icon: "⚛️" },
  ],

  hotbar: [                              // decorative bottom hotbar
    { icon: "⚔️" },
    { icon: "💎", count: 12 },
  ],

  experiences: [
    { title: "Senior Engineer", detail: "Led the platform team.", icon: "🗡️" },
  ],

  contactLinks: [
    { label: "github.com/ada", href: "https://github.com/ada", icon: "🐙" },
    { label: "Download Resume", href: "/ada-resume.pdf", icon: "📥" },
  ],
};

<Craftfolio data={data} />;
```

**Field notes**

| Field | Notes |
| --- | --- |
| `project.accent` | Any CSS background value (e.g. a `linear-gradient(...)`). No Tailwind required — use any colors. |
| `skill.colors` | `[topFaceColor, sideFaceColor]` hex pair for the pseudo-3D block. |
| `stats[].value` | `0–100`; rendered as 10 hearts (halves supported). |
| `hotbar[].count` | Optional number badge on the slot. |
| Fonts | *Press Start 2P* + *VT323* are injected from Google Fonts automatically. |

---

## 🎛️ Options

```tsx
<Craftfolio
  data={data}
  options={{
    defaultTheme: "night",
    enable3D: true,
    showThemeToggle: true,
    sections: ["hero", "projects", "skills", "experience", "contact"],
  }}
/>
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `"day" \| "night"` | `"day"` | Starting theme. The user's toggle choice is remembered in `localStorage`. |
| `enable3D` | `boolean` | `true` | Render the live Three.js voxel scenes. Set `false` for a lightweight, WebGL-free build (gradients only). |
| `showThemeToggle` | `boolean` | `true` | Show the sun/moon toggle in the navbar. |
| `sections` | `SectionKey[]` | all 6 | Which sections to render, **in order**. Keys: `"hero" \| "about" \| "projects" \| "skills" \| "experience" \| "contact"`. |

---

## 🌗 Theming & day/night

- Built-in **day (sunset)** and **night (moonlit)** themes with a navbar toggle.
- The theme drives the sky gradient, sun ↔ moon, cloud/star layers, water tint, and the voxel palette.
- Read or control it yourself with the `useTheme()` hook (see below).

---

## 🪝 Exports & hooks

```ts
import {
  Craftfolio,        // the component (default export too)
  usePortfolio,      // () => merged data + options (use inside custom children)
  useTheme,          // () => { theme, isNight, toggle, setTheme }
  defaultData,       // the built-in example content
  mergeData,         // (partial) => full PortfolioData
  mergeOptions,      // (partial) => full options
} from "craftfolio";

import type {
  PortfolioData, PortfolioOptions, Profile, Project, Skill,
  Stat, HotbarItem, Experience, ContactLink, NavLink, SectionKey, Theme,
} from "craftfolio";
```

---

## 🧠 How it works

```
<Craftfolio>
 └─ ThemeProvider ─ PortfolioProvider ─ .craftfolio (scoped root)
     ├─ Navbar
     └─ <main> renders options.sections in order:
        Hero · About · Projects · Skills · Experience · Contact
```

- **Data** is deep-merged over defaults and provided via context — sections never hardcode content.
- **3D scenes** (`VoxelWorld`) are lazy-loaded, so Three.js lands in its own chunk off the critical path.
- **Styles** ship precompiled in `craftfolio/styles.css` with Tailwind preflight disabled; resets are scoped to `.craftfolio` so the host app is untouched.

---

## ⚡ Performance

The voxel worlds are engineered to be cheap:

- **Instanced geometry** — each block type is one `InstancedMesh` (a handful of draw calls total).
- **Column face-culling** — only surface + exposed cliff blocks are generated; buried voxels are skipped.
- **Baked shadows** — the shadow map renders once, then freezes (terrain and light are static).
- **Visibility-gated rendering** — a scene only renders while it's on-screen and the tab is visible.
- **DPR + FPS caps** — background scenes cap device pixel ratio at 1.5 and throttle to ~30fps.
- **Lazy WebGL** — the 3D bundle loads separately; set `enable3D: false` to skip it entirely.

Core bundle is small (React/Three/Framer are external peers/deps); the 3D chunk loads on demand.

---

## ♿ Accessibility

- Decorative 3D and effect layers are marked `aria-hidden`.
- All motion (camera drift, water, clouds, parallax) respects `prefers-reduced-motion`.
- Text sits on scrims/panels for contrast over busy scenes.

> Full WCAG conformance depends on your content (link labels, color choices). Test with real assistive tech before shipping.

---

## 🌐 Browser support

Modern evergreen browsers with **WebGL** (Chrome, Edge, Firefox, Safari). Without WebGL the 3D scenes won't render — set `enable3D: false` for a graceful, gradient-only fallback. Requires client-side rendering (uses `window`/WebGL), so mark it a client component under SSR frameworks.

---

## ❓ FAQ

<details>
<summary><b>Does this magically re-skin my existing site?</b></summary>

No — and nothing safely can. Craftfolio is a full-page component you render (typically as your main route) with your data. It replaces the UI on that route with the Minecraft theme.
</details>

<details>
<summary><b>Do I need Tailwind configured?</b></summary>

No. The styles are precompiled and shipped in `craftfolio/styles.css`. Just import it.
</details>

<details>
<summary><b>Will it clash with my app's CSS?</b></summary>

No. Tailwind's global preflight is disabled and all resets are scoped under `.craftfolio`.
</details>

<details>
<summary><b>It errors during SSR / on the server.</b></summary>

Render it client-side. In Next.js App Router, add <code>"use client"</code> to the page/component that renders Craftfolio.
</details>

<details>
<summary><b>Can I use only some sections?</b></summary>

Yes — pass <code>options.sections</code> with the keys you want, in the order you want.
</details>

---

## 🗺️ Roadmap

- [ ] `craftfolio init` CLI to scaffold a typed data file + page
- [ ] More biomes/themes (End, cherry grove, snowy)
- [ ] Optional blog / posts section
- [ ] Headless mode: export individual sections for custom layouts
- [ ] i18n-friendly labels

Have an idea? [Open an issue.](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/issues)

---

## 🤝 Contributing

Contributions are welcome! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for setup, project layout, and the release process.

```bash
npm install
npm run dev        # local playground
npm run build:lib  # build the package
```

---

## 📄 License

[MIT](./LICENSE) © Shivansh Goel and Craftfolio contributors

<div align="center">

**If Craftfolio helped you, consider giving it a ⭐ — it helps a ton.**

Made with 🧱 and ☕

</div>
