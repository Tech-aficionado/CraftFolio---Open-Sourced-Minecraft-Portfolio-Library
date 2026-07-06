# Contributing to Craftfolio

Thanks for your interest in improving Craftfolio! Contributions of all kinds are welcome — bug reports, features, docs, and new Minecraft-flavored ideas.

## Getting started

```bash
git clone https://github.com/Tech-aficionado/CraftFolio---Open-Sourced-Minecraft-Portfolio-Library.git
cd CraftFolio---Open-Sourced-Minecraft-Portfolio-Library
npm install
npm run dev        # open the local playground (built-in demo content)
```

Requirements: Node 18+ and npm.

## Project layout

```
src/
  Craftfolio.tsx        # root component (providers + section renderer)
  index.ts              # public package entry (exports)
  types.ts              # PortfolioData contract + options
  defaultData.ts        # default content + deep-merge helpers
  PortfolioContext.tsx  # data context (usePortfolio)
  theme/ThemeContext.tsx# day/night theme
  index.css             # Tailwind + scoped .craftfolio styles
  components/            # sections (Hero, About, …) + primitives (VoxelWorld, Cube3D, …)
```

- The published package is built from `src/index.ts` only (`src/App.tsx` / `src/main.tsx` are the local demo and are excluded).
- All content flows through `usePortfolio()`; never hardcode data in components.
- Styles are scoped under `.craftfolio` and Tailwind preflight is disabled so the library never touches a host app's styles. Keep new global styles scoped.

## Development workflow

1. Create a branch: `git checkout -b feat/my-change`.
2. Make your change. Keep the 3D/WebGL code guarded by the `enable3D` option and honor `prefers-reduced-motion`.
3. Verify it builds:
   ```bash
   npm run build       # type-checks + builds the demo
   npm run build:lib   # builds the publishable package (ESM + CJS + types + css)
   ```
4. Commit using clear, conventional messages (e.g. `feat(sections): …`, `fix(voxel): …`, `docs: …`).
5. Open a pull request against `main` describing what changed and why.

## Guidelines

- **TypeScript**: keep it strict; no `any` unless justified. Export public types from `src/types.ts`.
- **Performance**: the voxel scenes must stay cheap — batch geometry, gate rendering by visibility, and avoid per-frame allocations.
- **Accessibility**: decorative 3D layers use `aria-hidden`; keep text contrast readable over scenes.
- **Data-driven**: new sections should read from context and ship sensible defaults in `defaultData.ts`.

## Releasing (maintainers)

Publishing is automated via `.github/workflows/publish.yml` (needs the `NPM_TOKEN` repo secret). There are two ways to publish:

**A. Manual run with a version (easiest)**

Actions → **Publish to npm** → **Run workflow**, and enter a `version`:
- an exact version like `1.0.1`, or
- a bump keyword: `patch` / `minor` / `major`.

The workflow bumps `package.json`, commits + tags it, pushes, builds, and publishes. Leave the field blank to publish `package.json` as-is.

Or via the CLI:

```bash
gh workflow run publish.yml -f version=patch
```

**B. GitHub Release**

Bump locally, then publish a Release (the tag triggers the workflow):

```bash
npm version patch   # or minor / major
git push --follow-tags
```

> npm rejects re-publishing an existing version — always bump before publishing.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
