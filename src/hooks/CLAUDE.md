# CLAUDE.md

Guidance for Claude Code when working in `src/hooks/`.

## Conventions

- Each hook is a single `.ts` file named `use{Name}.ts` with a default export.
- Hooks are app-specific, not generic. `usePrevious` is typed narrowly to `{ columns: number; rows: number }` because `gridContext` is its only caller — when generalizing, update both the hook signature and `gridContext.tsx`.
- Keep hooks framework-only (`react` imports). Do not import from `../components`, `../container`, or `../context` — that creates cycles, since contexts consume these hooks.
