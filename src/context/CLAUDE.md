# CLAUDE.md

Guidance for Claude Code when working in `src/context/`.

## Contexts

- `formContext.tsx` — `columns`, `rows`, `columnGap`, `rowGap` and their setters. Drives the control panel inputs.
- `gridContext.tsx` — derived grid state: `colArr` / `rowArr` (per-track units), `columnTemplate` / `rowTemplate` (the CSS strings), `divNum`, and `childArea`. Depends on `FormContext`, so `GridProvider` must be rendered inside `FormProvider`.

## Conventions

- Each file exports `default` the context object and a named `{Name}Provider` component. Consumers import the default and call `useContext(...)`.
- The context value is typed with a `{Name}ContextType` and created with `createContext<T>({} as T)` — the empty cast is intentional; providers always supply a real value.
- Setters are typed as `(val: X) => void`, matching `React.Dispatch<SetStateAction<X>>` callsites without importing the dispatch type.
- `gridContext` recomputes `columnTemplate` / `rowTemplate` from `colArr` / `rowArr` via `groupRepeatedUnits` + `createRepetition` from `../utils/repetition`. When changing track-array shape, update both utilities and this effect together.
- `gridContext` uses `usePrevious` from `../hooks/usePrevious` to diff `rows` / `columns` across renders; `adjustArr` then grows or shrinks the unit arrays accordingly. Preserve the order of effects in `GridProvider` — the initial `createArr` effect must run before the diff effects.

## Adding a new context

Place it here, follow the default-export + named-provider pattern, and wire the provider in `src/index.tsx` outside any provider that depends on it.
