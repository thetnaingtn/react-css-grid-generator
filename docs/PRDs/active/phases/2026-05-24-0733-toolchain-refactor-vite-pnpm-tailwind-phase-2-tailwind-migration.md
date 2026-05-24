# Toolchain Refactor: Vite 8 + pnpm + Tailwind CSS - Phase 2: Tailwind Setup + styled-components Removal

**Source PRD**: `docs/PRDs/active/2026-05-24-0733-toolchain-refactor-vite-pnpm-tailwind.md`
**PRD ID**: PRD-2026-05-24-0733
**Phase**: 2 of 3
**Status**: Ready
**Created**: May 24, 2026
**Author**: thetnaingtn

---

## Objective

Replace the entire `styled-components` styling system with Tailwind CSS v4, wired through `@tailwindcss/vite` (no PostCSS pipeline). Every `styles.{ts,js}` file is deleted and the corresponding markup gets inline Tailwind class names. By the end of this phase, `styled-components` and `@types/styled-components` are removed from `package.json`, the `form/styles.js` legacy file is gone (finishing the TypeScript migration), and the UI is pixel-identical to `main`.

**Heads-up from Phase 1:** `styled-components/macro` imports were already rewritten to plain `styled-components` during Phase 1 (Rolldown rejected the macro entry's missing `css` ESM export). No `/macro` references remain in source — Phase 2 just deletes the styled-components code wholesale.

Dynamic CSS values (e.g. `grid-template-columns` strings computed from user input) stay as inline `style={{}}` props — Tailwind cannot express runtime-computed track strings.

## Scope

### In Scope

- Install `tailwindcss@^4` and `@tailwindcss/vite`; register the plugin in `vite.config.ts`
- Confirm no `postcss.config.*` file exists (Tailwind v4 with the Vite plugin handles CSS directly)
- Create `src/index.css` as the Tailwind entry point
- Port global styles from `src/global-styles.ts` into `src/index.css`; delete the styled-components file
- Extract theme tokens (colors, fonts, breakpoints) from existing `styles.ts` files into Tailwind theme config via the `@theme` CSS block
- Migrate every component's `styles.{ts,js}` to inline Tailwind classes
- Delete `src/container/wrapper.ts`; replace with an inline Tailwind wrapper in `App.tsx`
- Use inline `style={{}}` for genuinely dynamic CSS (grid track templates, gap values driven by `FormContext`)
- Convert `src/components/form/styles.js` content fully — the file is deleted, completing JS→TS migration
- Remove `styled-components`, `@types/styled-components`, `babel-plugin-styled-components` from `package.json`

### Out of Scope

- New Tailwind features beyond reproducing existing styles (no dark mode, no design refresh)
- Component refactors beyond the className swap
- Tests (Phase 3)
- CLAUDE.md / README updates (Phase 3)
- Any modification to logic in `src/context/`, `src/hooks/`, `src/utils/` (those have no styled-components)

---

## Inputs

| Input | Source | Notes |
| ----- | ------ | ----- |
| Existing styled-component definitions | `src/components/grid/styles.ts`, `src/components/form/styles.js`, `src/components/code/styles/code.ts`, `src/components/explain/styles.ts`, `src/components/modal-dialog/*`, `src/container/wrapper.ts`, `src/global-styles.ts` | Source of truth for every class to reproduce |
| Dynamic prop interfaces | `src/components/grid/styles.ts` (`GapType`, `ColumnSizeSelectorType`, etc.) | Identifies which CSS values must remain inline `style={{}}` |
| Working Vite + React 18 + pnpm setup | Phase 1 output | Required before this phase begins |
| Tailwind v4 + `@tailwindcss/vite` docs | https://tailwindcss.com | v4 uses CSS-first config (`@theme` block in CSS, not `tailwind.config.js`) |

## Dependencies

| Dependency | Type | Required Before | Notes |
| ---------- | ---- | --------------- | ----- |
| Phase 1 complete | Code | Task 1 | Vite must boot and serve the existing app |
| `@tailwindcss/vite` compatible with Vite 8 | External | Task 1 | Check release notes; PRD risk table documents a Vite 7 fallback if not |

---

## Implementation Tasks

### Task 1: Install Tailwind v4 + Vite plugin

- [ ] `pnpm add -D tailwindcss@^4 @tailwindcss/vite`
- [ ] Edit `vite.config.ts` to import and register `@tailwindcss/vite`:
  ```ts
  import tailwindcss from "@tailwindcss/vite";
  // ...
  plugins: [react(), tailwindcss()],
  ```
- [ ] Verify `postcss.config.{js,cjs,mjs,ts}` does NOT exist — if any is present, delete it
- [ ] `pnpm dev` still serves the app (no CSS yet, styled-components still active)

**Acceptance Criteria:**

- `tailwindcss` and `@tailwindcss/vite` appear in `devDependencies`
- `vite.config.ts` registers the plugin alongside `@vitejs/plugin-react`
- No `postcss.config.*` file exists
- App still renders

**Files / Areas:**

- `package.json` — add Tailwind devDeps
- `vite.config.ts` — register plugin

### Task 2: Create the Tailwind entry CSS

- [ ] Create `src/index.css`:
  ```css
  @import "tailwindcss";

  @theme {
    /* Populated in Task 3 from extracted tokens */
  }
  ```
- [ ] Import `src/index.css` from `src/index.tsx` (before the `GlobalStyles` import for predictable cascade)
- [ ] Confirm dev server hot-reloads CSS without errors

**Acceptance Criteria:**

- `src/index.css` exists with the `@import "tailwindcss";` directive
- `src/index.tsx` imports it
- A test class like `<div className="text-red-500">` renders red in dev

**Files / Areas:**

- `src/index.css` — new
- `src/index.tsx` — add CSS import

### Task 3: Extract theme tokens into `@theme`

- [ ] Read every `styles.{ts,js}` file plus `src/global-styles.ts` and list:
  - Colors used (hex / named)
  - Font families
  - Custom breakpoints beyond Tailwind defaults (note `@media screen and (max-width: 700px)` — Tailwind's `md:` is 768px, so add a custom `--breakpoint-tablet: 700px`)
  - Custom font sizes
- [ ] Add the extracted tokens to the `@theme` block in `src/index.css` using v4 CSS variable syntax (`--color-*`, `--font-*`, `--breakpoint-*`)
- [ ] Port any global resets from `src/global-styles.ts` into the same `src/index.css` (outside `@theme`)

**Acceptance Criteria:**

- All custom tokens are declared in `@theme`
- The 700px breakpoint is available (e.g. usable as `max-tablet:flex-col`)

**Files / Areas:**

- `src/index.css` — populated `@theme` block + global resets

### Task 4: Migrate `src/components/grid/`

- [ ] Open `src/components/grid/index.tsx` and `src/components/grid/styles.ts` side-by-side
- [ ] For each styled element (`AppGridMain`, `AppGridColumnSizeSelector`, `AppGridRowSizeSelector`, `Grid`, `GridChildren`, `GridChildrenArea`, `StyledError`, `AppGridContainer`):
  - Translate static CSS to Tailwind utility classes
  - For dynamic values (`columnGap`, `rowGap`, `colTemplate`, `rowTemplate`, `widthFull`, `childArea`) use inline `style={{}}` for the CSS that depends on those props
  - Replace the JSX element with a `div`/appropriate tag carrying the className + style
- [ ] Delete `src/components/grid/styles.ts`
- [ ] Visually compare to `main`: grid lines, gaps, child overlay all match

**Acceptance Criteria:**

- `grid/styles.ts` deleted
- `grid/index.tsx` has no styled-components imports
- Grid resizes correctly with row/column input changes
- Drag-select still creates child areas in the right cells

**Files / Areas:**

- `src/components/grid/index.tsx` — rewritten to use Tailwind + inline style
- `src/components/grid/styles.ts` — deleted

### Task 5: Migrate `src/components/form/` (also finish JS→TS migration)

- [ ] Read both `form/index.tsx` (which has inline styled-components for `StyledWat`, `StyledControlPanel`) and `form/styles.js`
- [ ] Translate all styled elements to Tailwind classes inline in `form/index.tsx`
- [ ] Delete `form/styles.js`
- [ ] Ensure `form/index.tsx` is the only file in the folder (besides `index.tsx`)
- [ ] Verify font family, font size, margins on the control panel match the previous appearance

**Acceptance Criteria:**

- `form/styles.js` deleted (zero `.js` files remain in `src/`)
- `form/index.tsx` has no `styled-components` import
- The "wat" link still triggers the modal

**Files / Areas:**

- `src/components/form/index.tsx` — Tailwind classNames
- `src/components/form/styles.js` — deleted

### Task 6: Migrate `src/components/code/`

- [ ] Translate every export in `code/styles/code.ts` (e.g. `AppCode.Title`, `AppCode.GridCode`, `AppCode.ButtonToggle`, `AppCode.ButtonCopy`, `AppCode.CName`, `AppCode.CProps`, `AppCode.CKey`, `AppCode.Sp`) to Tailwind classes
- [ ] Decide compound-component representation: either keep `AppCode.X` as small functional components wrapping a `<span>` / `<div>` with Tailwind, or flatten the API and update callers in `src/container/code.tsx`
- [ ] Delete `code/styles/code.ts` and the empty `code/styles/` folder
- [ ] Verify CSS / HTML toggle in the code panel still renders the syntax-highlighted output

**Acceptance Criteria:**

- `code/styles/` folder deleted
- Code panel renders identically; "Show CSS" / "Show HTML" toggle works
- Copy-to-Clipboard works

**Files / Areas:**

- `src/components/code/index.tsx` — Tailwind classNames + compound components reimplemented
- `src/components/code/styles/code.ts` — deleted
- `src/container/code.tsx` — adjust call sites if the compound API changed

### Task 7: Migrate `src/components/explain/` and `src/components/modal-dialog/`

- [ ] Translate `explain/styles.ts` exports to Tailwind classes in `explain/index.tsx`; delete the styles file
- [ ] If `modal-dialog/` has any styled-components (inline in `index.tsx`), translate them; delete any associated styles file
- [ ] Verify modal overlay, dialog content, and close behavior unchanged

**Acceptance Criteria:**

- No `styled-components` imports remain in either folder
- Modal opens / closes; explain content renders

**Files / Areas:**

- `src/components/explain/index.tsx`, `src/components/explain/styles.ts` (deleted)
- `src/components/modal-dialog/index.tsx` (and any styles file, deleted)

### Task 8: Migrate `src/components/header/` (sanity check)

- [ ] Open `header/index.tsx`; if it uses inline `styled` definitions or imports a styles file, translate to Tailwind
- [ ] No file should remain that imports `styled-components` after this task

**Acceptance Criteria:**

- Header renders identically
- `grep -r "styled-components" src/components/header` returns nothing

**Files / Areas:**

- `src/components/header/index.tsx`

### Task 9: Migrate `src/container/wrapper.ts` and `App.tsx`

- [ ] In `src/App.tsx`, replace `<Wrapper>` with `<section className="flex max-tablet:flex-col">` (or equivalent reproducing the `wrapper.ts` CSS)
- [ ] Replace `StylesApp` styled-div with `<div className="mx-[5vmin] mt-[5vmin]">`
- [ ] Remove the `Wrapper` import and the `styled` import
- [ ] Delete `src/container/wrapper.ts`

**Acceptance Criteria:**

- `src/App.tsx` has no `styled-components` imports
- `src/container/wrapper.ts` deleted
- Layout collapses to single column below 700px viewport width

**Files / Areas:**

- `src/App.tsx` — Tailwind shell
- `src/container/wrapper.ts` — deleted

### Task 10: Remove `styled-components` and `GlobalStyles`

- [ ] Delete `src/global-styles.ts`
- [ ] Remove `GlobalStyles` import from `src/index.tsx`
- [ ] Remove from `package.json`: `styled-components`, `@types/styled-components`, `babel-plugin-styled-components` (if present)
- [ ] `pnpm install` to prune
- [ ] `grep -r "styled-components" src` returns zero results
- [ ] `find src -name "styles.*" -type f` returns zero results (any leftover styles files must be removed)

**Acceptance Criteria:**

- Zero references to `styled-components` in `src/`
- Zero `styles.*` files in `src/`
- `pnpm list styled-components` returns nothing

**Files / Areas:**

- `src/global-styles.ts` — deleted
- `src/index.tsx` — drop `GlobalStyles`
- `package.json` — drop styled-components deps

### Task 11: End-to-end Phase 2 verification

- [ ] `pnpm dev` — app renders with Tailwind only, no console errors
- [ ] `pnpm build` — succeeds; check `dist/assets/*.css` is generated by Tailwind
- [ ] `pnpm preview` — production bundle matches dev visually
- [ ] Side-by-side screenshot vs. `main`: header, grid, form, code panel, modal all pixel-equivalent

**Acceptance Criteria:**

- All commands succeed
- UI is visually identical to `main` (within sub-pixel font rendering tolerance)

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
test -z "$(grep -r 'styled-components' src 2>/dev/null)" && echo "no styled-components imports"
test -z "$(find src -name 'styles.*' -type f 2>/dev/null)" && echo "no styles files"
test ! -e postcss.config.js && test ! -e postcss.config.cjs && test ! -e postcss.config.mjs && test ! -e postcss.config.ts && echo "no postcss config"
```

### Manual

1. `pnpm dev` → header, grid, form, code panel render
2. Adjust column count from 5 → 8 → grid resizes; track widths driven by inline `style.gridTemplateColumns`
3. Adjust row gap → gap between cells changes
4. Drag-select cells → child area appears in correct position
5. Toggle CSS / HTML view in code panel → both views show the syntax-highlighted output
6. Click "Copy to Clipboard" → button label changes to "Code Copied" for 3 seconds
7. Type an invalid unit (`5foo`) → inline error appears in red; type `1fr` → error clears
8. Open modal via "wat" link → overlay shows; click outside or close → modal hides
9. Resize viewport to <700px → form moves below grid (single-column layout)
10. Side-by-side compare against `main` branch checkout in a second browser window

---

## Risks

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |
| Tailwind v4 `@theme` syntax differs from v3 mental model | Medium | Reference Tailwind v4 docs for `@theme` and `@import` — config lives in CSS, not `tailwind.config.js` |
| Pixel drift on fonts, line-heights, or arbitrary CSS values | High | Use Tailwind arbitrary value syntax (`mx-[5vmin]`, `text-[22px]`) to match exact values; visual diff in Task 11 |
| Dynamic grid track strings can't be expressed in Tailwind | Certain | Use inline `style={{ gridTemplateColumns: columnTemplate }}` — already called out in PRD risks |
| `@tailwindcss/vite` peer-dep mismatch with Vite 8 | Medium | If install fails, fall back to Vite 7 (PRD risk row) — do NOT switch to PostCSS |
| Compound component pattern in `AppCode.X` breaks during refactor | Medium | Keep the compound API by wrapping each `<span>`/`<div>` in a named functional component; update tests in Phase 3 if needed |
| `styled-components/macro` removal leaves dangling `babel-plugin-styled-components` references | Low | Search `package.json` and any leftover `.babelrc` — delete. (Phase 1 already rewrote all `/macro` imports to plain `styled-components`; only the package.json dep cleanup remains here) |

## Open Questions

- Should the compound `AppCode` API be preserved as functional-component wrappers, or flattened into raw `<span>` with Tailwind classes inlined at call sites? (Recommend: preserve compound API for readability)
- Are there any `:hover` / `:focus` styles in current styled-components that need explicit Tailwind variants (`hover:`, `focus:`)? Audit during migration
- Tailwind v4 includes a Preflight reset — does it conflict with any existing global resets in `global-styles.ts`? Reconcile in Task 3

## Definition of Done

- [ ] All implementation tasks completed
- [ ] Acceptance criteria verified
- [ ] Zero `styled-components` imports in `src/`
- [ ] Zero `styles.{ts,js}` files in `src/`
- [ ] Zero `.js` files in `src/` (TypeScript migration complete)
- [ ] No `postcss.config.*` file exists
- [ ] `pnpm build` succeeds; Tailwind-generated CSS is present in `dist/`
- [ ] Visual parity with `main` confirmed
- [ ] No unresolved blockers remain

---

## Handoff Notes

After Phase 2, Phase 3 starts from a fully Tailwind-styled, fully TypeScript app on Vite 8 + React 18. Phase 3's responsibilities:

- Vitest test files for `utils/validatator.ts`, `utils/repetition.ts`, and a `<App />` smoke test
- Rewrite `src/setupTests.ts` for Vitest (`@testing-library/jest-dom/vitest`)
- Update the root `CLAUDE.md` and all five subdirectory `CLAUDE.md` files: drop `styled-components/macro` guidance, drop yarn/CRA commands, mention Tailwind class conventions
- Update `README.md` with pnpm + Vite install/run instructions

If the compound `AppCode` API was kept (recommended), Phase 3 tests can target it as-is. If it was flattened, the smoke test should still pass without adjustment but call sites in `src/container/code.tsx` will have changed shape.

Note any Strict Mode warnings observed during Phase 2 dev — Phase 3 is the right time to address them.
