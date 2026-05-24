# CLAUDE.md

Guidance for Claude Code when working in `src/components/`.

## Layout

Each component lives in its own folder with:
- `index.tsx` — default-exported React function component
- `styles.ts` (or legacy `styles.js`) — `styled-components/macro` styled elements

A few files (e.g. `form/styles.js`) are still JavaScript; the repo is mid-migration to TypeScript. New styles files must be `.ts`.

## Exports

`src/components/index.tsx` re-exports every component as `App{Name}` (e.g. `AppGrid`, `AppForm`, `AppModal`). When adding a component, add it to this barrel using the `App` prefix. Import sibling components through this barrel (`from "../index"` or `from "../../components"`) rather than reaching into folders directly.

## Styling

- Use `styled-components/macro` (not `styled-components`) so generated class names are readable.
- Styled elements that take dynamic props must have a typed prop interface in `styles.ts` (see `grid/styles.ts` for the pattern: a `GapType` base extended per element).

## State

Components consume app state via `useContext(FormContext)` and `useContext(GridContext)` from `../../context/`. Do not create local copies of grid/form state — mutate through the setters exposed by the context value.

## Exported types

Component-local types (e.g. `ErrorType` in `grid/index.tsx`) are exported when other modules need them — `utils/validatator.ts` imports `ErrorType` from `../components/grid`. Keep such types exported and stable.
