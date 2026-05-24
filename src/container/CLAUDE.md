# CLAUDE.md

Guidance for Claude Code when working in `src/container/`.

## Purpose

Containers are the stateful glue between contexts and presentational components in `src/components/`. They:
- Read from `FormContext` / `GridContext`
- Hold UI state that isn't shared globally (`useState`, `useRef`)
- Handle DOM-side effects (clipboard, selection, refs)
- Render the matching `App*` component from `../components` and pass values into its compound subcomponents (e.g. `AppCode.Title`, `AppCode.GridCode`)

Keep DOM/clipboard/selection logic here, not in `components/`. Components should stay focused on markup and styling.

## Files

- `code.tsx` — `AppCodeContainer`, drives the generated-code panel
- `wrapper.ts` — shared `Wrapper` styled-component used at the app shell level

`wrapper.ts` is the only styled-component file under `container/`. Component-specific styles belong in the component's own folder, not here.
