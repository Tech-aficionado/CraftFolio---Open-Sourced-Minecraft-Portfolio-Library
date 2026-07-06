# Craftfolio

A drop-in React component that turns your content into a complete **Minecraft-themed** developer portfolio — a sunset overworld hero with a **live 3D voxel world**, an inventory of skill blocks, a heart-bar stats panel, an enchanting-table experience timeline, and a Nether-portal contact section. Built with React, Three.js, and Framer Motion.

## Install

```bash
npm install craftfolio
```

`react` and `react-dom` (v18+) are peer dependencies. `three` and `framer-motion` are installed automatically.

## Usage

```tsx
import { Craftfolio } from "craftfolio";
import "craftfolio/styles.css";

export default function App() {
  return (
    <Craftfolio
      data={{
        profile: {
          name: "Ada Lovelace",
          firstName: "Ada",
          lastName: "Lovelace",
          role: "Software Engineer",
          brand: "ADACRAFT",
          tagline: "I build the future, one block at a time.",
          about: "Full-stack developer who loves clean code and pixel art.",
        },
        projects: [
          {
            title: "Analytical Engine",
            description: "The first general-purpose computer.",
            tags: ["Mechanical", "Math"],
            href: "https://example.com",
            accent: "linear-gradient(135deg, #a78bfa, #6d28d9)",
            emoji: "⚙️",
          },
        ],
      }}
    />
  );
}
```

Everything you don't provide falls back to built-in example content, so you can start with a single field and fill in the rest over time.

> Drop it in as a full-page route (e.g. your app's `/`) to replace your existing UI with the Minecraft theme.

## Options

```tsx
<Craftfolio
  data={myData}
  options={{
    defaultTheme: "night",        // "day" | "night"  (has a toggle)
    enable3D: false,              // turn off the WebGL voxel scenes
    showThemeToggle: true,        // show the day/night button in the navbar
    sections: ["hero", "projects", "skills", "contact"], // pick & order sections
  }}
/>
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `"day" \| "night"` | `"day"` | Initial theme (remembers the user's last choice). |
| `enable3D` | `boolean` | `true` | Render the live Three.js voxel worlds. Set `false` for a lightweight, WebGL-free build. |
| `showThemeToggle` | `boolean` | `true` | Show the sun/moon toggle in the navbar. |
| `sections` | `SectionKey[]` | all six | Which sections to render, in order. |

## Data shape

The full `PortfolioData` type is exported. Top-level keys: `profile`, `stats`, `navLinks`, `projects`, `skills`, `hotbar`, `experiences`, `contactLinks`. All are optional in the `data` prop (deep-merged over defaults).

```ts
import type { PortfolioData } from "craftfolio";
```

Notes:
- `project.accent` is any CSS background value (e.g. a `linear-gradient(...)`), so you can use any colors without Tailwind.
- `skill.colors` is `[topFaceColor, sideFaceColor]` (hex) for the 3D block.
- Fonts (Press Start 2P + VT323) are injected from Google Fonts automatically.

## Styling / isolation

The bundled `styles.css` has Tailwind's global preflight **disabled**; all resets are scoped to the component's `.craftfolio` wrapper, so it won't clobber the rest of your app.

## Also exported

```ts
import {
  Craftfolio,
  usePortfolio,   // read the merged data inside custom children
  useTheme,       // { theme, isNight, toggle, setTheme }
  defaultData,
  mergeData,
} from "craftfolio";
```

## Local development

```bash
npm run dev        # run the demo/playground (uses the built-in content)
npm run build:lib  # build the publishable package into ./dist
```

## License

MIT
