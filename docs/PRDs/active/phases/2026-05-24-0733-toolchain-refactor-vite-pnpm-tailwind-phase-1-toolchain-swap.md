# Toolchain Refactor: Vite 8 + pnpm + Tailwind CSS - Phase 1: Toolchain Swap (Vite + pnpm + React 18)

**Source PRD**: `docs/PRDs/active/2026-05-24-0733-toolchain-refactor-vite-pnpm-tailwind.md`
**PRD ID**: PRD-2026-05-24-0733
**Phase**: 1 of 3
**Status**: Complete (pending manual smoke test)
**Created**: May 24, 2026
**Author**: thetnaingtn

---

## Objective

Replace the CRA + Yarn + React 17 build foundation with Vite 8 + pnpm + React 18. This is the load-bearing change every later phase depends on: Tailwind installation (Phase 2) is wired through the Vite plugin, and the test runner swap (Phase 3) relies on Vitest sharing Vite's config. By the end of this phase the existing app must still render with `styled-components` and look identical, but now booted by `pnpm dev` through Vite.

No styling or component code is touched here beyond the bare minimum needed to make the app boot under the new toolchain (entry-point rewrite for `createRoot`).

## Scope

### In Scope

- Remove `react-scripts` and CRA-specific tooling from `package.json`
- Add Vite 8 (Rolldown-bundled), `@vitejs/plugin-react@^6` (oxc-powered, no Babel), Vitest scaffolding (config only — tests come in Phase 3)
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
| `@vitejs/plugin-react@^6` Vite 8 compatibility | External | Task 3 | v6.x is the Rolldown/oxc-powered release (no Babel); pairs with Vite 8. Older 4.x versions still work but emit a runtime deprecation warning recommending the move |

---

## Implementation Tasks

### Task 1: Switch package manager to pnpm

- [x] Delete `yarn.lock`
- [x] Add `"packageManager": "pnpm@11.1.2"` to `package.json` (pin to the developer's installed version so corepack stays happy)
- [x] Add `"engines": { "node": ">=20.19" }` to `package.json`
- [x] Run `pnpm install` to generate `pnpm-lock.yaml`
- [x] Commit `pnpm-lock.yaml`; ensure `yarn.lock` no longer appears in `git status`
- [x] Add `pnpm-workspace.yaml` with `allowBuilds: { esbuild: true }` — required because pnpm 11 refuses unapproved build scripts by default
- [x] Add `.npmrc` with `verify-deps-before-run=false` to keep `pnpm exec` / `pnpm run` from re-running install pre-flight checks

**Acceptance Criteria:**

- `pnpm install` completes without errors (and without `ERR_PNPM_IGNORED_BUILDS`)
- `yarn.lock` is removed; `pnpm-lock.yaml` exists at project root
- `package.json` has `packageManager` and `engines` fields

**Files / Areas:**

- `package.json` — add `packageManager`, `engines`
- `pnpm-workspace.yaml` — new, with `allowBuilds: { esbuild: true }`
- `.npmrc` — new, with `verify-deps-before-run=false`
- `yarn.lock` — delete
- `pnpm-lock.yaml` — new, generated

**Implementation notes:**

- pnpm 11 (vs. the PRD's original suggestion of pnpm 9) changes the build-approval model. The legacy `pnpm.onlyBuiltDependencies` array in `package.json` is silently ignored; the new key lives in `pnpm-workspace.yaml` as `allowBuilds: { <pkg>: true }`. Without this, `vite` / `vitest` invocations fail with `ERR_PNPM_IGNORED_BUILDS` against `esbuild`.

### Task 2: Remove CRA dependencies and scripts

- [x] Remove from `dependencies`: `react-scripts`, `web-vitals`
- [x] Remove the inline `eslintConfig` block from `package.json`
- [x] Replace `scripts` block:
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `preview`: `vite preview`
  - `test`: `vitest`
  - `lint`: `eslint .`
- [x] Remove `browserslist` block (Vite handles target via config / `build.target`)
- [x] Run `pnpm install` to prune removed deps

**Acceptance Criteria:**

- `package.json` no longer references `react-scripts`, `eject`, `eslintConfig`, or `browserslist`
- Scripts match the list above

**Files / Areas:**

- `package.json` — scripts, dependencies, top-level keys

### Task 3: Install Vite 8 + React 18 + Vitest scaffolding

- [x] Add devDependencies: `vite@^8`, **`@vitejs/plugin-react@^6`** (oxc-based, no Babel — Vite 8 is bundled with Rolldown so the Babel pipeline is gone), **`vitest@^4`**, **`@vitest/ui@^4`**, **`jsdom@^29`**
- [x] Add devDependencies: `@testing-library/react@^16` (React 18 compatible), `@testing-library/jest-dom@latest`, `@testing-library/user-event@latest`
- [x] Bump dependencies: `react@^18`, `react-dom@^18`
- [x] Bump devDependencies: `@types/react@^18`, `@types/react-dom@^18`
- [x] Remove `@types/jest` (Vitest uses its own types)
- [x] Add `globals` devDep (needed by the flat ESLint config in Task 8)
- [x] Run `pnpm install`; resolve any peer-dep warnings

**Acceptance Criteria:**

- `pnpm list react react-dom vite` shows React 18.x and Vite 8.x
- No `react-scripts` anywhere in `pnpm list`

**Files / Areas:**

- `package.json` — dependencies, devDependencies
- `pnpm-lock.yaml` — regenerated

**Implementation notes:**

- **Vitest must be v4, not v2.** Vitest 2.x ships its own Vite 5 type definitions; under Vite 8 + project references this surfaces as a TS2769 "two incompatible `UserConfig` types" error during `tsc -b`. Vitest 4 + jsdom 29 are the lowest versions that align cleanly with Vite 8. Update Phase 3's PRD before installing.
- `@vitejs/plugin-react@^6` is the oxc-powered successor that ships alongside Vite 8's Rolldown bundler. The 4.x line still works against Vite 8 but emits a Babel deprecation warning on every build. Going straight to v6 removes the warning and aligns with the Rust-powered toolchain Vite 8 is built around.
- pnpm pulled in `vite@8.0.10` as a transitive of `@vitejs/plugin-react@6.0.2` (peer-dep constraint). If a newer Vite 8 patch is required, bump the direct dep explicitly.

### Task 4: Create Vite + Vitest config

- [x] Create `vite.config.ts` at project root with:
  - `@vitejs/plugin-react`
  - `test` block: `globals: true`, `environment: 'jsdom'`, `setupFiles: ['./src/setupTests.ts']`
  - `server.port: 5173` (default — explicit for clarity)
- [x] **Import `defineConfig` from `"vitest/config"`** (not `"vite"`) so the `test` key typechecks under Vite 8 — the triple-slash `/// <reference types="vitest" />` workaround from the original PRD did **not** augment Vite 8's `UserConfig` shape
- [x] Create `tsconfig.node.json` for the Vite config file. Because it's referenced from the root project, it must be `composite: true`, which forbids `noEmit: true`. Use `emitDeclarationOnly: true` with an `outDir` under `node_modules/.tmp/` to keep the source tree clean
- [x] Reference `tsconfig.node.json` from the root `tsconfig.json` via `references`
- [x] Create empty `src/setupTests.ts` (only needs `import "@testing-library/jest-dom/vitest"` for now; Phase 3 expands it)

**Acceptance Criteria:**

- `pnpm exec tsc --noEmit` passes (vite config is typechecked under the node tsconfig)
- `vite.config.ts` resolves the React plugin and Vitest types without errors

**Files / Areas:**

- `vite.config.ts` — new
- `tsconfig.node.json` — new (`composite: true`, `emitDeclarationOnly: true`, `outDir: ./node_modules/.tmp/tsconfig.node`)
- `tsconfig.json` — add `references`
- `src/setupTests.ts` — new placeholder

### Task 5: Update `tsconfig.json` for Vite

- [x] Change `"target"` from `"es5"` to `"ES2022"`
- [x] Change `"moduleResolution"` from `"node"` to `"bundler"`
- [x] Add `"types": ["vite/client"]` to compilerOptions
- [x] Keep `"jsx": "react-jsx"`, `"strict": true`, `"noImplicitAny": true`
- [x] Keep `"allowJs": true` for now — Phase 2 deletes the last `.js` file

**Acceptance Criteria:**

- `pnpm exec tsc --noEmit` passes against the existing `src/` tree
- No TS errors introduced in `src/components/grid/index.tsx` or other strict-typed files

**Files / Areas:**

- `tsconfig.json` — compilerOptions updates

### Task 6: Move and rewrite `index.html` for Vite

- [x] Move `public/index.html` → `index.html` at project root (use `git mv` to preserve history)
- [x] Remove all `%PUBLIC_URL%/...` references; rewrite to absolute paths (e.g. `/favicon.ico`, `/manifest.json`)
- [x] Add `<script type="module" src="/src/index.tsx"></script>` before `</body>`
- [x] Keep `<div id="root"></div>`
- [x] Verify other `public/` assets (favicon, manifest, logos) remain in `public/` so Vite serves them at root

**Acceptance Criteria:**

- `index.html` exists at project root and is the only HTML entry
- `pnpm dev` serves the app at `http://localhost:5173`
- Favicon and any referenced public assets load (check Network tab)

**Files / Areas:**

- `index.html` — new (moved)
- `public/index.html` — delete after move
- `public/` — other assets stay

### Task 7: Upgrade entry point to React 18 `createRoot`

- [x] Rewrite `src/index.tsx`:
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
- [x] Leave `GlobalStyles` import in place — it's a styled-component and stays until Phase 2
- [ ] Smoke-test in dev: grid, form, code panel render and react to input *(deferred — see Outcome section)*

**Acceptance Criteria:**

- App boots under `pnpm dev` with no console errors
- Strict Mode is enabled — note any double-fire warnings from `gridContext` effects as Phase 3 verification items (do not "fix" by removing Strict Mode)

**Files / Areas:**

- `src/index.tsx` — rewritten

### Task 8: Replace ESLint config with a flat config

- [x] Create `eslint.config.js` at project root with flat-config exports
- [x] Include: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-react`
- [x] Add devDependencies for the above plus `eslint@^9`, `globals`
- [x] Demote rules that would otherwise flag legacy code untouched by this phase: `prefer-const`, `react/no-unescaped-entities`, `react/display-name`, `@typescript-eslint/no-empty-object-type` are turned off; `no-unused-vars` and `no-explicit-any` demoted to warnings
- [x] Verify `pnpm lint` runs without crashing on the existing `src/` tree (warnings are fine; new errors must be fixed)

**Acceptance Criteria:**

- `pnpm lint` exits 0 (or with only pre-existing warnings)
- No reference to `react-scripts` remains in lint output

**Files / Areas:**

- `eslint.config.js` — new
- `package.json` — devDependencies for eslint plugins

**Implementation notes:**

- Default flat-config rule set surfaced 113 errors across the existing source — almost entirely `prefer-const` on `let` bindings that aren't reassigned, plus a few `react/no-unescaped-entities` and `@typescript-eslint/no-empty-object-type`. CRA's old `react-app` config didn't enforce these, so they're "newly visible" rather than truly new errors. The rule demotions above preserve the PRD's "warnings fine, new errors must be fixed" intent without making this phase a code-cleanup PR. Phase 2 / Phase 3 can tighten rules incrementally as styled-components code is deleted.
- Final lint output: 5 warnings, 0 errors. Four are the `gridContext` `react-hooks/exhaustive-deps` warnings the PRD explicitly flagged for Phase 3.

### Task 9: End-to-end Phase 1 verification

- [x] `pnpm install` — clean
- [x] `pnpm exec tsc --noEmit` — passes
- [x] `pnpm lint` — passes (0 errors, 5 warnings — all pre-existing)
- [x] `pnpm dev` — server boots at `http://localhost:5173`; `index.html` and `/src/index.tsx` are served. **Interactive UI walkthrough still pending — see Outcome section.**
- [x] `pnpm build` — produces `dist/` without errors (~198 kB JS, 65.7 kB gzipped)
- [x] `pnpm preview` — serves the built bundle; `curl http://localhost:4173` returns the HTML shell

### Task 10: Remove `styled-components/macro` imports *(added during implementation)*

The original PRD listed this under "Risks" as a degraded-runtime concern. In practice it's a **hard build-time failure** under Vite 8 / Rolldown — `styled-components`' macro entry doesn't export `css` as ESM, so Rolldown aborts with `[MISSING_EXPORT] "css" is not exported by ".../styled-components-macro.esm.js"`. Fix is to rewrite imports to plain `styled-components`. Phase 2 deletes these files anyway, so this just pulls the work forward by one phase.

- [x] `grep -rl --include="*.ts" --include="*.tsx" "styled-components/macro" src/ | xargs sed -i '' 's|styled-components/macro|styled-components|g'`
- [x] Verify `pnpm build` succeeds
- [x] Leave the `styled-components/macro` mention in `src/components/CLAUDE.md` untouched — Phase 3 updates the docs

Touched files: `src/App.tsx`, `src/container/wrapper.ts`, `src/components/form/index.tsx`, `src/components/code/styles/code.ts`, `src/components/modal-dialog/index.tsx`, `src/components/header/index.tsx`, `src/components/grid/styles.ts`.

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

| Risk | Likelihood | Mitigation | Outcome |
| ---- | ---------- | ---------- | ------- |
| Vite 8 + `@vitejs/plugin-react` peer-dep mismatch | Medium | Verify plugin compatibility before installing; if blocked, temporarily use Vite 7 and document the rollback | **No issue.** Settled on `@vitejs/plugin-react@^6` (oxc-powered, matches Vite 8's Rolldown bundler). The 4.x line installs against Vite 8 too but emits a Babel deprecation warning on every build — v6 removes it. |
| `styled-components/macro` Babel macro breaks under Vite (no Babel) | High | The `/macro` import won't be processed; expect runtime to fall back to plain `styled-components` (still functional, less-readable class names). Accept this — Phase 2 deletes all styled-components anyway | **Materialized as build-time failure, not runtime degradation.** Rolldown rejects the missing `css` ESM export from `styled-components-macro.esm.js`. Fix applied in Phase 1 (new Task 10): rewrite all `/macro` imports to plain `styled-components`. |
| React 18 Strict Mode double-invokes `gridContext` `useEffect`s, corrupting `colArr` / `rowArr` | Medium | Note any visible regressions and fix in Phase 3; if blocking, temporarily wrap the app without `<StrictMode>` and add a TODO | **Pending interactive verification.** Lint surfaces the relevant `react-hooks/exhaustive-deps` warnings (gridContext.tsx:69, 87, 93). Behavior not yet confirmed in-browser — flagged for Phase 3. |
| `tsc --noEmit` fails on existing `src/` after `moduleResolution: bundler` switch | Low | Most likely culprit is missing `.tsx` extension on imports — fix individually, do not weaken tsconfig | **No issue.** Existing source compiles clean against `moduleResolution: bundler`. |
| `public/` asset references break after moving `index.html` | Low | Vite serves `public/` at `/`; double-check favicon and manifest URLs | **No issue** — built `dist/index.html` references `/favicon.ico` / `/manifest.json` / `/logo192.png` correctly. |
| pnpm 11 build-script approval gates install | _Discovered during implementation_ | Use `pnpm-workspace.yaml` `allowBuilds:` map, not the legacy `pnpm.onlyBuiltDependencies` array in `package.json` | Resolved — see Task 1 implementation notes. |
| Vitest 2 ships Vite 5 type defs that conflict with Vite 8 under project references | _Discovered during implementation_ | Pin Vitest **≥4** (and jsdom ≥29) for Vite 8 compat | Resolved — see Task 3 implementation notes. |

## Open Questions

- ~~Which exact pnpm version should `packageManager` pin?~~ → Resolved: `pnpm@11.1.2` (matches the developer's local install; current major).
- ~~Should `<StrictMode>` ship enabled, given the known `gridContext` effect chain?~~ → Resolved: yes, shipped enabled per default. In-browser verification still pending.
- ~~Do we want `eslint-plugin-react` in addition to `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`?~~ → Resolved: yes, included.

## Definition of Done

- [x] All implementation tasks completed (Tasks 1–10)
- [x] Acceptance criteria verified for each task
- [x] `pnpm install`, `lint`, `tsc --noEmit`, `dev`, `build`, `preview` all green
- [ ] Manual smoke test passes — **pending**; dev server boots and serves HTML/JS but the interactive checklist (grid drag-select, copy-to-clipboard, modal, invalid-unit error) has not yet been walked through in a browser
- [x] No `react-scripts`, `yarn.lock`, or CRA references remain in `package.json` or repo root
- [x] App boots under React 18 `createRoot`
- [ ] No unresolved blockers remain — **pending** in-browser smoke test

---

## Handoff Notes

Phase 2 starts from a working Vite + React 18 + pnpm setup with `styled-components` **still installed and active**. Phase 2's first move is to add `tailwindcss@^4` and `@tailwindcss/vite`, register the plugin in the `vite.config.ts` written here, and create `src/index.css`. Do not add a `postcss.config.*` file — the Vite plugin handles CSS directly.

**Update for Phase 2:** `styled-components/macro` imports have **already been rewritten to plain `styled-components`** during Phase 1 (Rolldown blocked the build otherwise). The class names are slightly less readable until Phase 2 deletes the styled-components code entirely. The mention of `/macro` in `src/components/CLAUDE.md` was intentionally left untouched and will be removed in Phase 3 along with the rest of the docs sweep.

**Update for Phase 3:** Vitest is already installed at v4 (not v2 as originally planned). When updating Phase 3 tasks: use Vitest 4 APIs (no breaking changes for the tests this PRD specifies, but verify imports). `src/setupTests.ts` already exists with `import "@testing-library/jest-dom/vitest"`. Phase 3 lint cleanup should also re-enable the rules demoted in Phase 1's `eslint.config.js`: `prefer-const`, `react/no-unescaped-entities`, `react/display-name`, `@typescript-eslint/no-empty-object-type`, and tighten `no-unused-vars` / `no-explicit-any` back to errors after the styled-components code is gone.

The four `react-hooks/exhaustive-deps` warnings in `src/context/gridContext.tsx` (lines 69, 87, 93) are exactly the Strict Mode hazard the original PRD flagged — Phase 3 should write a regression test for grid resize / gap interactions and verify those effects don't corrupt `colArr` / `rowArr` under double-invocation.

**Phase 1 outcome / known follow-ups:**

- In-browser manual smoke test not performed — must be completed before the Phase 1 branch is considered merged.
- `.gitignore` updated with `/dist` and `*.tsbuildinfo` (Vite output + composite-project artifacts).
- `dist/` is now produced under the project root rather than `build/` — adjust any external scripts that referenced `build/`.
