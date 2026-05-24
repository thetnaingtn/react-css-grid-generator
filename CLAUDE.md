# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React/TypeScript port of Sarah Drasner's CSS Grid Generator. Uses Create React App (`react-scripts` 4), React 17, `styled-components` 5, and Context for state.

## Commands

- `yarn start` — dev server
- `yarn build` — production build
- `yarn test` — Jest via react-scripts (watch mode by default; `CI=true yarn test` for one-shot)

This project uses **yarn**, not npm — `yarn.lock` is committed.

## Source layout

Each `src/` subdirectory has its own CLAUDE.md with detailed conventions. The high-level split:

- `src/components/` — presentational React components, one folder per component, re-exported as `App{Name}` from `src/components/index.tsx`
- `src/container/` — stateful glue between contexts and components (DOM/clipboard logic lives here)
- `src/context/` — `FormContext` and `GridContext`; `GridProvider` must be rendered inside `FormProvider`
- `src/hooks/` — app-specific hooks (currently `usePrevious`)
- `src/utils/` — pure helpers (`repetition.ts`, `validatator.ts` — spelling is intentional)
- `src/global-styles.ts`, `src/App.tsx`, `src/index.tsx` — entry and global styles

## Conventions that apply everywhere

- TypeScript is enabled with `strict` and `noImplicitAny`. A few legacy files (`form/styles.js`) are still JS; new files must be `.ts` / `.tsx`.
- Use `styled-components/macro` (not bare `styled-components`) so class names stay readable.
- ESLint config is inline in `package.json` (`react-app`, `react-app/jest`) — no separate `.eslintrc`.
- JSX runtime is `react-jsx` — do not add `import React from "react"` solely for JSX.

## TypeScript migration

The repo is mid-migration from JS to TS (see recent commits). When touching a `.js` file, prefer converting it to `.ts` / `.tsx` in the same change if the diff stays small.
