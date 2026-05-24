# CLAUDE.md

Guidance for Claude Code when working in `src/components/`.

## Layout

Each component lives in its own folder with an `index.tsx` (default-exported React function component). Styling is inline via Tailwind CSS v4 classes on the JSX — no separate `styles.*` files.

## Exports

`src/components/index.tsx` re-exports every component as `App{Name}` (e.g. `AppGrid`, `AppForm`, `AppModal`). When adding a component, add it to this barrel using the `App` prefix. Import sibling components through this barrel (`from "../index"` or `from "../../components"`) rather than reaching into folders directly.

## Styling

- Use Tailwind utility classes on JSX. Theme tokens (colors, fonts, the `tablet` breakpoint) live in `src/index.css` under `@theme`.
- Shared form-control primitives (`Button`, `Input`, `Label`, `Fieldset`) live in `src/components/ui/`. `Button` exposes a `variant` prop (`"primary" | "reset"`, default `"primary"`) via `class-variance-authority`. All four accept an extra `className` that is merged with `clsx`. Reuse these rather than re-deriving the styles on raw `<button>` / `<input>` elements.
- For CSS that depends on runtime values (grid track templates, gap values, per-child colors), use inline `style={{}}` — Tailwind cannot express runtime-computed strings.

## State

Components consume app state via `useContext(FormContext)` and `useContext(GridContext)` from `../../context/`. Do not create local copies of grid/form state — mutate through the setters exposed by the context value.

## Exported types

Component-local types (e.g. `ErrorType` in `grid/index.tsx`) are exported when other modules need them — `utils/validatator.ts` imports `ErrorType` from `../components/grid`. Keep such types exported and stable.
