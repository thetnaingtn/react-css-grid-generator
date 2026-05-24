# Toolchain Refactor: Vite 8 + pnpm + Tailwind CSS - Phase 1: Toolchain Swap (Vite + pnpm + React 18)

**Source PRD**: `docs/PRDs/active/2026-05-24-0733-toolchain-refactor-vite-pnpm-tailwind.md`
**PRD ID**: PRD-2026-05-24-0733
**Phase**: 1 of 3
**Status**: Ready
**Created**: May 24, 2026
**Author**: thetnaingtn

---

## Objective

Replace the CRA + Yarn + React 17 build foundation with Vite 8 + pnpm + React 18. This is the load-bearing change every later phase depends on: Tailwind installation (Phase 2) is wired through the Vite plugin, and the test runner swap (Phase 3) relies on Vitest sharing Vite's config. By the end of this phase the existing app must still render with `styled-components` and look identical, but now booted by `pnpm dev` through Vite.

No styling or component code is touched here beyond the bare minimum needed to make the app boot under the new toolchain (entry-point rewrite for `createRoot`).

## Scope

### In Scope

- Remove `react-scripts` and CRA-specific tooling from `package.json`
- Add Vite 8, `@vitejs/plugin-react`, Vitest scaffolding (config only — tests come in Phase 3)
- Switch package manager: delete `yarn.lock`, generate `pnpm-lock.yaml`, set `packageManager` field
- Upgrade React + React DOM to 18; rewrite `src/index.tsx` to use `createRoot`
- Move `public/index.html` to project root as Vite expects
- Replace CRA's inline ESLint config with a flat config that doesn't pull in `react-scripts`
- Update `tsconfig.json` for Vite's bundler module resolution
- Verify `pnpm dev`, `pnpm build`, `pnpm preview` all run with the existing styled-components code intact

### Out of Scope

- Tailwind installation, theme config, or any styling migration (Phase 2)
- Deleting `styled-components` or any `styles.{ts,js}` files (Phase 2)
- Vitest test files or test conversions (Phase 3)
- CLAUDE.md / README updates (Phase 3)
- Visual / UX changes

---

## Inputs

| Input | Source | Notes |
| ----- | ------ | ----- |
| Existing `package.json` scripts | `package.json` | `start`, `build`, `test`, `eject` — replace with Vite equivalents |
| CRA `public/index.html` | `public/index.html` | Contains `%PUBLIC_URL%` tokens that must be rewritten for Vite |
| Current entry point | `src/index.tsx` | Uses `ReactDOM.render` — must move to `createRoot` |
| `tsconfig.json` | Project root | Targets `es5`, `module: esnext` — update to `moduleResolution: "bundler"` and add Vite client types |
| React 18 upgrade guidance | PRD §Solution item 4 | `createRoot` API; verify Strict Mode behavior |

## Dependencies

| Dependency | Type | Required Before | Notes |
| ---------- | ---- | --------------- | ----- |
| pnpm installed locally | External | Task 1 | `corepack enable && corepack prepare pnpm@latest --activate` works |
| Node version supporting Vite 8 | External | Task 1 | Vite 8 requires Node 20.19+ / 22.12+; declare in `engines` |
| `@vitejs/plugin-react` Vite 8 compatibility | External | Task 3 | Verify the latest release supports Vite 8 before pinning |

---

## Implementation Tasks

### Task 1: Switch package manager to pnpm

- [ ] Delete `yarn.lock`
- [ ] Add `"packageManager": "pnpm@9.x"` to `package.json` (use a current pnpm version)
- [ ] Add `"engines": { "node": ">=20.19" }` to `package.json`
- [ ] Run `pnpm install` to generate `pnpm-lock.yaml`
- [ ] Commit `pnpm-lock.yaml`; ensure `yarn.lock` no longer appears in `git status`

**Acceptance Criteria:**

- `pnpm install` completes without errors
- `yarn.lock` is removed; `pnpm-lock.yaml` exists at project root
- `package.json` has `packageManager` and `engines` fields

**Files / Areas:**

- `package.json` — add `packageManager`, `engines`
- `yarn.lock` — delete
- `pnpm-lock.yaml` — new, generated

### Task 2: Remove CRA dependencies and scripts

- [ ] Remove from `dependencies`: `react-scripts`, `web-vitals`
- [ ] Remove the inline `eslintConfig` block from `package.json`
- [ ] Replace `scripts` block:
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `preview`: `vite preview`
  - `test`: `vitest`
  - `lint`: `eslint .`
- [ ] Remove `browserslist` block (Vite handles target via config / `build.target`)
- [ ] Run `pnpm install` to prune removed deps

**Acceptance Criteria:**

- `package.json` no longer references `react-scripts`, `eject`, `eslintConfig`, or `browserslist`
- Scripts match the list above

**Files / Areas:**

- `package.json` — scripts, dependencies, top-level keys

### Task 3: Install Vite 8 + React 18 + Vitest scaffolding

- [ ] Add devDependencies: `vite@^8`, `@vitejs/plugin-react`, `vitest`, `@vitest/ui`, `jsdom`
- [ ] Add devDependencies: `@testing-library/react@^16` (React 18 compatible), `@testing-library/jest-dom@latest`, `@testing-library/user-event@latest`
- [ ] Bump dependencies: `react@^18`, `react-dom@^18`
- [ ] Bump devDependencies: `@types/react@^18`, `@types/react-dom@^18`
- [ ] Remove `@types/jest` (Vitest uses its own types)
- [ ] Run `pnpm install`; resolve any peer-dep warnings

**Acceptance Criteria:**

- `pnpm list react react-dom vite` shows React 18.x and Vite 8.x
- No `react-scripts` anywhere in `pnpm list`

**Files / Areas:**

- `package.json` — dependencies, devDependencies
- `pnpm-lock.yaml` — regenerated

### Task 4: Create Vite + Vitest config

- [ ] Create `vite.config.ts` at project root with:
  - `@vitejs/plugin-react`
  - `test` block: `globals: true`, `environment: 'jsdom'`, `setupFiles: ['./src/setupTests.ts']`
  - `server.port: 5173` (default — explicit for clarity)
- [ ] Add `/// <reference types="vitest" />` at the top so the `test` block typechecks
- [ ] Create `tsconfig.node.json` for the Vite config file (`module: "ESNext"`, `moduleResolution: "bundler"`, `allowSyntheticDefaultImports`)
- [ ] Reference `tsconfig.node.json` from the root `tsconfig.json` via `references`

**Acceptance Criteria:**

- `pnpm exec tsc --noEmit` passes (vite config is typechecked under the node tsconfig)
- `vite.config.ts` resolves the React plugin and Vitest types without errors

**Files / Areas:**

- `vite.config.ts` — new
- `tsconfig.node.json` — new
- `tsconfig.json` — add `references`

### Task 5: Update `tsconfig.json` for Vite

- [ ] Change `"target"` from `"es5"` to `"ES2022"`
- [ ] Change `"moduleResolution"` from `"node"` to `"bundler"`
- [ ] Add `"types": ["vite/client"]` to compilerOptions
- [ ] Keep `"jsx": "react-jsx"`, `"strict": true`, `"noImplicitAny": true`
- [ ] Keep `"allowJs": true` for now — Phase 2 deletes the last `.js` file

**Acceptance Criteria:**

- `pnpm exec tsc --noEmit` passes against the existing `src/` tree
- No TS errors introduced in `src/components/grid/index.tsx` or other strict-typed files

**Files / Areas:**

- `tsconfig.json` — compilerOptions updates

### Task 6: Move and rewrite `index.html` for Vite

- [ ] Move `public/index.html` → `index.html` at project root
- [ ] Remove all `%PUBLIC_URL%/...` references; rewrite to absolute paths (e.g. `/favicon.ico`, `/manifest.json`)
- [ ] Add `<script type="module" src="/src/index.tsx"></script>` before `</body>`
- [ ] Keep `<div id="root"></div>`
- [ ] Verify other `public/` assets (favicon, manifest, logos) remain in `public/` so Vite serves them at root

**Acceptance Criteria:**

- `index.html` exists at project root and is the only HTML entry
- `pnpm dev` serves the app at `http://localhost:5173`
- Favicon and any referenced public assets load (check Network tab)

**Files / Areas:**

- `index.html` — new (moved)
- `public/index.html` — delete after move
- `public/` — other assets stay

### Task 7: Upgrade entry point to React 18 `createRoot`

- [ ] Rewrite `src/index.tsx`:
  ```ts
  import { createRoot } from "react-dom/client";
  import { StrictMode } from "react";
  import App from "./App";
  import { GlobalStyles } from "./global-styles";

  const container = document.getElementById("root");
  if (!container) throw new Error("Root container missing");
  createRoot(container).render(
    <StrictMode>
      <GlobalStyles />
      <App />
    </StrictMode>
  );
  ```
- [ ] Leave `GlobalStyles` import in place — it's a styled-component and stays until Phase 2
- [ ] Smoke-test in dev: grid, form, code panel render and react to input

**Acceptance Criteria:**

- App boots under `pnpm dev` with no console errors
- Strict Mode is enabled — note any double-fire warnings from `gridContext` effects as Phase 3 verification items (do not "fix" by removing Strict Mode)

**Files / Areas:**

- `src/index.tsx` — rewritten

### Task 8: Replace ESLint config with a flat config

- [ ] Create `eslint.config.js` at project root with flat-config exports
- [ ] Include: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- [ ] Add devDependencies for the above plus `eslint@^9`
- [ ] Verify `pnpm lint` runs without crashing on the existing `src/` tree (warnings are fine; new errors must be fixed)

**Acceptance Criteria:**

- `pnpm lint` exits 0 (or with only pre-existing warnings)
- No reference to `react-scripts` remains in lint output

**Files / Areas:**

- `eslint.config.js` — new
- `package.json` — devDependencies for eslint plugins

### Task 9: End-to-end Phase 1 verification

- [ ] `pnpm install` — clean
- [ ] `pnpm exec tsc --noEmit` — passes
- [ ] `pnpm lint` — passes
- [ ] `pnpm dev` — app loads at `http://localhost:5173`, header/grid/form/code panel render, copy-to-clipboard works
- [ ] `pnpm build` — produces `dist/` without errors
- [ ] `pnpm preview` — serves the built bundle; behaves identically to `pnpm dev`

**Acceptance Criteria:**

- All five commands succeed
- App is visually identical to the pre-refactor `main` branch (styled-components still in place)

**Files / Areas:**

- n/a — verification only

---

## Verification

### Automated

```bash
pnpm install
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm preview --port 4173 &
sleep 2
curl -sf http://localhost:4173 > /dev/null && echo "preview OK"
kill %1
```

### Manual

1. `pnpm dev` → open `http://localhost:5173`; header, grid, form, code panel render
2. Change column / row counts via the form → grid resizes; no console errors
3. Drag-select a region in the grid → child area appears; CSS in code panel updates
4. Click "Copy to Clipboard" → button text changes to "Code Copied" for 3 seconds
5. Open the modal-dialog (the "wat" link) → opens and closes
6. Open browser devtools → check for React 18 warnings; note any Strict Mode double-render output from `gridContext` effects

---

## Risks

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |
| Vite 8 + `@vitejs/plugin-react` peer-dep mismatch | Medium | Verify plugin compatibility before installing; if blocked, temporarily use Vite 7 and document the rollback |
| `styled-components/macro` Babel macro breaks under Vite (no Babel) | High | The `/macro` import won't be processed; expect runtime to fall back to plain `styled-components` (still functional, less-readable class names). Accept this — Phase 2 deletes all styled-components anyway |
| React 18 Strict Mode double-invokes `gridContext` `useEffect`s, corrupting `colArr` / `rowArr` | Medium | Note any visible regressions and fix in Phase 3; if blocking, temporarily wrap the app without `<StrictMode>` and add a TODO |
| `tsc --noEmit` fails on existing `src/` after `moduleResolution: bundler` switch | Low | Most likely culprit is missing `.tsx` extension on imports — fix individually, do not weaken tsconfig |
| `public/` asset references break after moving `index.html` | Low | Vite serves `public/` at `/`; double-check favicon and manifest URLs |

## Open Questions

- Which exact pnpm version should `packageManager` pin? (Suggest current LTS, e.g. `pnpm@9.15.0`)
- Should `<StrictMode>` ship enabled, given the known `gridContext` effect chain? (Default: yes; revisit if visible bugs surface)
- Do we want `eslint-plugin-react` in addition to `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`? (Recommend yes for `jsx-key` and similar rules)

## Definition of Done

- [ ] All implementation tasks completed
- [ ] Acceptance criteria verified
- [ ] `pnpm install`, `lint`, `tsc --noEmit`, `dev`, `build`, `preview` all green
- [ ] Manual smoke test passes
- [ ] No `react-scripts`, `yarn.lock`, or CRA references remain in `package.json` or repo root
- [ ] App boots under React 18 `createRoot`
- [ ] No unresolved blockers remain

---

## Handoff Notes

Phase 2 starts from a working Vite + React 18 + pnpm setup with `styled-components` **still installed and active**. Phase 2's first move is to add `tailwindcss@^4` and `@tailwindcss/vite`, register the plugin in the `vite.config.ts` written here, and create `src/index.css`. Do not add a `postcss.config.*` file — the Vite plugin handles CSS directly.

The `styled-components/macro` imports are likely degraded (no Babel) but still functional in Vite. Phase 2 deletes them all, so the degraded class names are a temporary cost only.

Note for Phase 3: log any Strict Mode warnings observed during the Phase 1 manual smoke test — those become Phase 3 test cases or fixes.
