# Toolchain Refactor: Vite 8 + pnpm + Tailwind CSS - Phase 3: Tests, Docs, and Verification

**Source PRD**: `docs/PRDs/active/2026-05-24-0733-toolchain-refactor-vite-pnpm-tailwind.md`
**PRD ID**: PRD-2026-05-24-0733
**Phase**: 3 of 3
**Status**: Ready
**Created**: May 24, 2026
**Author**: thetnaingtn

---

## Objective

Close out the refactor: wire up Vitest with real tests, fix any React 18 Strict Mode regressions surfaced in Phases 1–2, and bring every `CLAUDE.md` plus `README.md` in line with the new toolchain. The branch must be ready to merge with green automated checks and pixel parity to `main`.

This phase produces the first real automated test coverage the repo has had — the CRA template never had tests committed.

## Scope

### In Scope

- Expand `src/setupTests.ts` for Vitest — file already exists from Phase 1 with `import "@testing-library/jest-dom/vitest"`; add any further Vitest 4 setup here
- Re-tighten the ESLint rules Phase 1 demoted (`prefer-const`, `react/no-unescaped-entities`, `react/display-name`, `@typescript-eslint/no-empty-object-type`, `no-unused-vars`, `no-explicit-any`) once styled-components code is gone
- Add a smoke test for `<App />` that renders the app under both providers and asserts the header is present
- Add unit tests for `src/utils/validatator.ts` (`fr`, `px`, `auto`, an invalid unit) and `src/utils/repetition.ts` (`groupRepeatedUnits` + `createRepetition` round-trip)
- Address any React 18 Strict Mode warnings logged during Phases 1–2 manual smoke tests (typically in `gridContext` effects)
- Update root `CLAUDE.md`: pnpm/Vite commands, drop styled-components rule, mention Tailwind v4 + `@tailwindcss/vite`
- Update each subdirectory `CLAUDE.md` (`components/`, `container/`, `context/`, `hooks/`, `utils/`) to remove stale references (styled-components, `.js` files, `wrapper.ts`)
- Update `README.md` install/run instructions
- Final visual parity check vs. `main`

### Out of Scope

- Expanding test coverage beyond the smoke + two utility specs (defer to a follow-up)
- New product features
- CI configuration (PRD §Out of Scope)
- Performance tuning beyond what falls out of removing styled-components

---

## Inputs

| Input | Source | Notes |
| ----- | ------ | ----- |
| Working Vite + Tailwind app | Phases 1 + 2 output | Required to test against |
| Strict Mode observations from Phases 1–2 | Manual smoke tests | List of any `gridContext` / effect chain regressions to fix |
| Existing `CLAUDE.md` content | Root + five subdirectory files | Source for the diffs — most lines stay; specific items are replaced |
| Existing `README.md` | Project root | Currently has yarn install instructions to replace |
| `utils/validatator.ts`, `utils/repetition.ts` source | `src/utils/` | Target of unit tests |
| `<App />` provider order | `src/App.tsx` | `FormProvider` must wrap `GridProvider`; tests must mount the same tree |

## Dependencies

| Dependency | Type | Required Before | Notes |
| ---------- | ---- | --------------- | ----- |
| Phase 1 complete | Code | Task 1 | Vitest scaffolding installed |
| Phase 2 complete | Code | Task 4, Task 6 | Tailwind in place; doc updates reference the new stack |
| Strict Mode observations | Decision | Task 5 | If no issues surfaced, Task 5 is a no-op |

---

## Implementation Tasks

### Task 1: Set up `src/setupTests.ts` for Vitest

- [ ] Replace the contents of `src/setupTests.ts` (or create if missing) with:
  ```ts
  import "@testing-library/jest-dom/vitest";
  ```
- [ ] Confirm `vite.config.ts` test block points `setupFiles` at `./src/setupTests.ts`
- [ ] Run `pnpm test --run` — should pass with zero tests collected (sanity)

**Acceptance Criteria:**

- `pnpm test --run` exits 0 even before any test files exist
- `expect(...).toBeInTheDocument()` is type-resolved (no TS error in editor)

**Files / Areas:**

- `src/setupTests.ts` — rewritten

### Task 2: Smoke test for `<App />`

- [ ] Create `src/App.test.tsx`:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import App from "./App";

  describe("<App />", () => {
    it("renders the header", () => {
      render(<App />);
      // adjust selector to match actual header text
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });
  ```
- [ ] If the header doesn't have a `banner` role, switch to `screen.getByText(/grid generator/i)` or similar based on actual content
- [ ] Run `pnpm test --run src/App.test.tsx` — passes

**Acceptance Criteria:**

- The smoke test passes
- No console errors during render

**Files / Areas:**

- `src/App.test.tsx` — new

### Task 3: Unit tests for `utils/validatator.ts`

- [ ] Create `src/utils/validatator.test.ts`:
  - Accepts `1fr`, `100px`, `50%`, `2em`, `1rem`, `auto`, `min-content`, `max-content`, `minmax(100px, 1fr)`
  - Rejects `5foo` (pushes index into `errors.col`)
  - Calling with a previously errored index using a valid unit removes the index from `errors.col`
- [ ] Cover both `col` and `row` directions
- [ ] Note the mutating behavior of `validator` in a test comment (per `src/utils/CLAUDE.md`)
- [ ] Run `pnpm test --run src/utils/validatator.test.ts` — passes

**Acceptance Criteria:**

- All valid CSS grid units pass through with no error pushed
- Invalid units push the index into the right direction array

**Files / Areas:**

- `src/utils/validatator.test.ts` — new

### Task 4: Unit tests for `utils/repetition.ts`

- [ ] Create `src/utils/repetition.test.ts`:
  - `groupRepeatedUnits([{unit:'1fr'},{unit:'1fr'},{unit:'2fr'}])` → `[['1fr','1fr'],['2fr']]`
  - `createRepetition([['1fr','1fr'],['2fr']])` → `"repeat(2, 1fr) 2fr"`
  - Round-trip: feeding a fresh `GridUnitType[]` produces the expected CSS string
- [ ] Cover the empty-input edge case (`groupRepeatedUnits([])`)
- [ ] Document the mutation contract of `groupRepeatedUnits` (per `src/utils/CLAUDE.md`) — pass fresh arrays in tests
- [ ] Run `pnpm test --run src/utils/repetition.test.ts` — passes

**Acceptance Criteria:**

- Grouping collapses adjacent duplicates
- `createRepetition` emits `repeat(n, unit)` for groups and bare values for singletons

**Files / Areas:**

- `src/utils/repetition.test.ts` — new

### Task 5: Fix any React 18 Strict Mode regressions

- [ ] Review the Strict Mode warnings noted during Phases 1–2 manual smoke tests
- [ ] Likely culprit: `GridProvider` effects that read `previousRows` / `previousColumns` via `usePrevious` — double-invocation under Strict Mode may corrupt the `colArr` / `rowArr` length on mount
- [ ] If a regression exists, refactor the relevant effect to be idempotent (e.g., guard against double-applying `adjustArr`, or move initial array creation to lazy `useState` initializer)
- [ ] If no regression exists, mark this task as N/A and document in the Phase 3 PR
- [ ] Re-run the manual smoke test under `<StrictMode>` to confirm

**Acceptance Criteria:**

- No console warnings about effect cleanup or stale state in dev
- Grid resize / gap changes still behave correctly under Strict Mode

**Files / Areas:**

- `src/context/gridContext.tsx` (likely)
- `src/hooks/usePrevious.ts` (if its semantics need clarification under double-invocation)

### Task 6: Update root `CLAUDE.md`

- [ ] Replace yarn commands with pnpm equivalents (`pnpm dev`, `pnpm build`, `pnpm test`, `pnpm preview`, `pnpm lint`)
- [ ] Remove the "This project uses yarn" note; replace with "This project uses pnpm — `pnpm-lock.yaml` is committed"
- [ ] Remove the "Use `styled-components/macro` (not bare `styled-components`)" convention
- [ ] Add a Tailwind section: "Styles are Tailwind v4 utility classes via `@tailwindcss/vite`. No PostCSS config. Theme tokens live in `src/index.css` under `@theme`. For runtime-computed CSS (grid track strings), use inline `style={{}}`"
- [ ] Update the "TypeScript migration" section: state it is complete; remove the JS-conversion guidance
- [ ] Update build / scaffolding paragraph: "Vite 8, React 18, TypeScript strict, Vitest"

**Acceptance Criteria:**

- Root `CLAUDE.md` has zero references to yarn, `react-scripts`, CRA, or `styled-components`
- Tailwind + `@tailwindcss/vite` is documented

**Files / Areas:**

- `CLAUDE.md`

### Task 7: Update subdirectory `CLAUDE.md` files

- [ ] `src/components/CLAUDE.md` — remove the `styled-components/macro` rule and the dynamic-prop interface guidance; add Tailwind class conventions; note that for long class lists, prefer extracting to a `cn`/`clsx`/`tailwind-merge` helper if introduced (otherwise inline); remove the "legacy `styles.js`" mention
- [ ] `src/container/CLAUDE.md` — remove `wrapper.ts` reference; update the "only styled-components file" line (no styled-components files exist now); restate the role: stateful glue, DOM/clipboard logic
- [ ] `src/context/CLAUDE.md` — no styled-components reference; check the migration-related lines and update if stale
- [ ] `src/hooks/CLAUDE.md` — minor: confirm no stale tooling references
- [ ] `src/utils/CLAUDE.md` — confirm the `validatator` spelling note and mutation contracts remain accurate; reference the new test files

**Acceptance Criteria:**

- `grep -r "styled-components" src/**/CLAUDE.md` returns zero results
- Each file accurately describes the current code state

**Files / Areas:**

- `src/components/CLAUDE.md`
- `src/container/CLAUDE.md`
- `src/context/CLAUDE.md`
- `src/hooks/CLAUDE.md`
- `src/utils/CLAUDE.md`

### Task 8: Update `README.md`

- [ ] Replace install instructions: `pnpm install`
- [ ] Replace run instructions: `pnpm dev`
- [ ] Add `pnpm test` and `pnpm build` lines
- [ ] Mention the new stack briefly (Vite 8, React 18, Tailwind v4, TypeScript)
- [ ] Remove any "built with Create React App" references

**Acceptance Criteria:**

- README accurately reflects how to install and run the project today

**Files / Areas:**

- `README.md`

### Task 9: Final end-to-end verification

- [ ] `pnpm install`
- [ ] `pnpm lint` — green
- [ ] `pnpm exec tsc --noEmit` — green
- [ ] `pnpm test --run` — all tests pass
- [ ] `pnpm build` — green
- [ ] `pnpm preview` — production bundle behaves correctly
- [ ] Run the full PRD §Testing manual checklist (10 items)
- [ ] Side-by-side visual diff against `main`

**Acceptance Criteria:**

- All automated checks pass
- All 10 manual verification items from the source PRD pass
- No visual regressions

**Files / Areas:**

- n/a — verification only

---

## Verification

### Automated

```bash
pnpm install
pnpm lint
pnpm exec tsc --noEmit
pnpm test --run
pnpm build
pnpm preview --port 4173 &
sleep 2
curl -sf http://localhost:4173 > /dev/null && echo "preview OK"
kill %1
grep -r "styled-components" src && echo "FAIL: styled-components reference remains" || echo "clean"
grep -r "yarn" CLAUDE.md src/**/CLAUDE.md README.md 2>/dev/null && echo "FAIL: yarn reference remains" || echo "clean"
```

### Manual

1. Run the full PRD §Testing manual checklist (steps 1–10)
2. Open browser devtools console under `pnpm dev` — zero React 18 / Strict Mode warnings
3. Check `dist/assets/*.css` after `pnpm build` — Tailwind utilities are present, no styled-components runtime
4. Read each `CLAUDE.md` and confirm no stale references slipped through

---

## Risks

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |
| Strict Mode regression in `gridContext` is harder to fix than expected | Medium | Time-box; if fix is non-trivial, ship without `<StrictMode>` and open a follow-up task with reproduction steps |
| `getByRole("banner")` selector in the smoke test doesn't match the header markup | Low | Adjust the assertion to whatever role/text the header actually exposes |
| `validator` mutation behavior makes tests order-dependent | Medium | Build a fresh `errors` object per test case; document the mutation in comments |
| README rewrites lose information the original had | Low | Diff against current README; preserve project description, attribution to Sarah Drasner |
| Updating CLAUDE.md files introduces inconsistencies between them | Medium | Re-read each file after editing; ensure the root file and subdirectory files agree on conventions |

## Open Questions

- Should we introduce `clsx` or `tailwind-merge` now, or wait until a real need surfaces? (Recommend: wait)
- Coverage thresholds — should `vitest` enforce a minimum? (Recommend: not in this PRD; revisit when test count grows)
- Does the header expose `role="banner"` natively, or does `<header>` need an explicit role? (Verify when writing Task 2)

## Definition of Done

- [ ] All implementation tasks completed
- [ ] Acceptance criteria verified
- [ ] `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test --run`, `pnpm build`, `pnpm preview` all green
- [ ] All 10 PRD manual verification steps pass
- [ ] Zero `styled-components` / yarn / `react-scripts` references in code or docs
- [ ] Root `CLAUDE.md`, five subdirectory `CLAUDE.md` files, and `README.md` all reflect the new toolchain
- [ ] Strict Mode runs cleanly (or known issue is documented as a follow-up)
- [ ] No unresolved blockers remain

---

## Handoff Notes

This is the final phase of the PRD. After it merges:

- Move the source PRD from `docs/PRDs/active/` to `docs/PRDs/completed/` (if that directory convention is used) and fill in the `## Summary` section with what was actually shipped
- Any deferred Strict Mode fix or test-coverage expansion gets its own follow-up PRD
- The skill-creator plugin can now produce new project skills against the modernized stack (the `/init` Phase 8 suggestion in this repo)

Implementation order across the three phases is strict: do not start Phase 2 before Phase 1 lands (Tailwind needs the Vite plugin); do not start Phase 3 before Phase 2 lands (CLAUDE.md updates assume Tailwind is in place and styled-components is gone).
