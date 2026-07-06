<div align="center">

# ⛏️ Craftfolio

### Turn your React app into a **Minecraft-themed developer portfolio** — with a live 3D voxel world — in one component.

[![npm version](https://img.shields.io/npm/v/craftfolio?logo=npm&logoColor=white&label=npm&color=cb3837)](https://www.npmjs.com/package/craftfolio)
[![downloads](https://img.shields.io/npm/dm/craftfolio?color=5b8731&label=downloads)](https://www.npmjs.com/package/craftfolio)
[![CI](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/actions/workflows/ci.yml/badge.svg)](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-6a0dad)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-5b8731)](./CONTRIBUTING.md)
[![stars](https://img.shields.io/github/stars/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library?logo=github&color=f0a815)](https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library/stargazers)

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white&labelColor=20232a)
![Three.js](https://img.shields.io/badge/Three.js-r169-black?logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-e535ab?logo=framer&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)

</div>

---

Add **one button** to your existing portfolio. Click it, and your whole site flips into a Minecraft theme — built from your own data — as a full-screen overlay. Click again (or press `Esc`) to return to your normal site.

```tsx
import { CraftfolioToggle } from "craftfolio";
import "craftfolio/styles.css";

// Drop this anywhere in your app. It renders a floating "Minecraft Mode" button.
<CraftfolioToggle data={myData} />;
```

That's the whole integration. When toggled on you get a full portfolio: a sunset overworld hero with a **real WebGL voxel landscape**, an inventory of 3D skill blocks, a heart-bar stats panel, an enchanting-table experience timeline, and a Nether-portal contact section — plus its own day/night switch.

Want it as a permanent page instead of a toggle? Use [`<Craftfolio />`](#option-b--full-page) directly.

---

## Table of contents

- [Features](#-features)
- [Quick start](#-quick-start)
  - [Option A — theme toggle (drop-in)](#option-a--theme-toggle-recommended-for-existing-sites)
  - [Option B — full page](#option-b--full-page)
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

- 🔘 **One-button theme toggle** — drop `<CraftfolioToggle />` onto your existing site; click to overlay the Minecraft theme, click (or `Esc`) to exit.
- 🧱 **One-component install** — or render `<Craftfolio />` directly for a full themed route.
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

`react` and `react-dom` (v18+) are peer dependencies. `three` and `framer-motion` install automatically. Import the stylesheet once: `import "craftfolio/styles.css"`.

Craftfolio renders WebGL and uses browser APIs, so it must run on the **client** (in Next.js App Router, add `"use client"`).

### Option A — theme toggle (recommended for existing sites)

Wrap your normal site as `children`. `CraftfolioToggle` renders it as-is and adds a floating button that **switches between your normal version and the Minecraft version**. When on, it overlays the full themed portfolio (portaled to `document.body`, background scroll locked, exits on `Esc`).

```tsx
"use client"; // Next.js App Router only

import { CraftfolioToggle } from "craftfolio";
import "craftfolio/styles.css";
import { portfolioData } from "./portfolio-data";

export default function Layout({ children }) {
  return (
    <CraftfolioToggle data={portfolioData} position="bottom-right" persist>
      {children /* your normal site */}
    </CraftfolioToggle>
  );
}
```

> No `children`? It still works — you just get the floating button + overlay, handy when your normal UI lives elsewhere on the page.

Prefer your own button? Hide the built-in one and drive it via state:

```tsx
const [on, setOn] = useState(false);

<>
  <button onClick={() => setOn(true)}>Try Minecraft mode</button>
  <CraftfolioToggle data={portfolioData} hideButton defaultActive={on} onChange={setOn} />
</>
```

### Option B — full page

Use the component directly to make an entire route the Minecraft portfolio:

```tsx
import { Craftfolio } from "craftfolio";
import "craftfolio/styles.css";
import { portfolioData } from "./portfolio-data";

export default function Page() {
  return <Craftfolio data={portfolioData} />;
}
```

> Styles are scoped to `.craftfolio`, so even the overlay won't leak into the rest of your app.

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

### `<CraftfolioToggle>` props

Everything above (`data`, `options`) plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Your normal site. Shown by default; the button switches to the Minecraft version and back. |
| `label` | `string` | `"Minecraft Mode"` | Button text when the theme is off. |
| `exitLabel` | `string` | `"Exit Minecraft"` | Button text when the theme is on. |
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Corner for the floating button. |
| `defaultActive` | `boolean` | `false` | Start with the theme already on. |
| `persist` | `boolean` | `false` | Remember on/off in `localStorage`. |
| `storageKey` | `string` | `"craftfolio:active"` | Key used when `persist` is on. |
| `onChange` | `(active: boolean) => void` | — | Fires on every toggle. |
| `hideButton` | `boolean` | `false` | Hide the built-in button and control it yourself. |
| `zIndex` | `number` | `2147483000` | Overlay z-index (button sits one above). |

---

## 🌗 Theming & day/night

- Built-in **day (sunset)** and **night (moonlit)** themes with a navbar toggle.
- The theme drives the sky gradient, sun ↔ moon, cloud/star layers, water tint, and the voxel palette.
- Read or control it yourself with the `useTheme()` hook (see below).

---

## 🪝 Exports & hooks

```ts
import {
  Craftfolio,        // full-page portfolio component
  CraftfolioToggle,  // floating button + overlay for existing sites
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
<summary><b>Does it change my existing site on a button click?</b></summary>

Yes — that's what <code>&lt;CraftfolioToggle&gt;</code> is for. It adds a floating button that overlays the full Minecraft theme (built from your data) on top of your current page, and exits back to your normal site on click or <kbd>Esc</kbd>. It's an overlay driven by your data, not an automatic rewrite of your existing DOM (nothing can safely do that). Prefer a dedicated themed route? Use <code>&lt;Craftfolio&gt;</code>.
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
