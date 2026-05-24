# CLAUDE.md

Guidance for Claude Code when working in `src/utils/`.

## Files

- `repetition.ts` — `groupRepeatedUnits` + `createRepetition`. Collapses adjacent identical track units into `repeat(n, unit)` strings used by `gridContext` to build `grid-template-columns` / `grid-template-rows`. `groupRepeatedUnits` mutates its input by `shift()`-ing — callers in `gridContext` pass fresh-mapped arrays; preserve that contract.
- `validatator.ts` (note the spelling — kept as-is to avoid a wide rename) — `validator` checks that a track unit ends in a real CSS grid unit (`fr`, `px`, `%`, `em`, `rem`, `vw`, `vh`, `vmin`, `q`, `mm`, `cm`, `in`, `pt`, `pc`, `ex`, `ch`), or is `minmax(...)`, `auto`, `min-content`, `max-content`, or parses to `0`. It **mutates and returns the `errors` object** passed in. When extending the allow-list, add the regex to this single chain.

## Conventions

- Pure functions only — no React, no DOM. If a helper needs hooks, it belongs in `src/hooks/`.
- Utilities may import types from `src/context/` and `src/components/` (e.g. `GridUnitType`, `ErrorType`) but must not import runtime values from them.
