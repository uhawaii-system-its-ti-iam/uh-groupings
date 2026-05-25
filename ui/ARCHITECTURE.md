# UI Architecture

This document defines the source layout conventions for `ui/src`.

## Goals

- Keep feature ownership obvious for human developers.
- Make file intent discoverable in 1-2 directory hops.
- Keep import style predictable for editors, code search, and LLM agents.

## Enforcement Summary

The conventions in this document are not just guidelines — most are enforced
automatically and fail the build when violated. New contributors and LLM
agents can rely on these guarantees holding.

| Rule | Enforced by | Fails on |
|---|---|---|
| `src/app` cannot use parent-relative imports (`../...`) | ESLint `no-restricted-imports` in `.eslintrc.json` | `npm run lint` |
| `src/components` and `src/lib` cannot import from `@/app/*` | ESLint `no-restricted-imports` in `.eslintrc.json` | `npm run lint` |
| Test directories must mirror source directories | `scripts/check-test-mirror.mjs` | `npm run check:structure` |
| Test files must have a matching source file (no orphans) | `scripts/check-test-mirror.mjs` | `npm run check:structure` |
| Minimum code coverage (85/80/85/85) | `vitest.config.mts` thresholds | `npm run test:coverage -- --run` |
| Function-component definition style (arrow functions) | ESLint `react/function-component-definition` | `npm run lint` |
| Single-quote string style, max line length 170 | ESLint `@stylistic` rules | `npm run lint` |
| No spying on `localStorage`, `global.localStorage`, or `window.localStorage` in tests | ESLint `no-restricted-syntax` (test files) | `npm run lint` |
| `tests/` directory is linted alongside `src/` and `scripts/` | `npm run lint` script (`next lint --dir src --dir tests --dir scripts`) | `npm run lint` |

Conventions that are human-enforced (reviewer responsibility, not yet
automated):

- Kebab-case file naming.
- Promotion of route-local components to `src/components` only after 2+ reuses.
- Use of `parts/` as the single name for table internals folders.
- Tests that exist must actually assert behavior, not just render.

The full CI pipeline that runs every enforcement gate is in
`.github/workflows/ci.yml`:

```sh
npm run lint
npm run check:structure
npm run test:coverage -- --run
```

## Source Layout

```text
src/
  app/          Next.js route tree and route-local UI
  components/   Reusable cross-route UI components
  lib/          Shared domain logic, HTTP, auth, and utilities
```

## Folder Ownership Rules

- `src/app/**/_components/*`: route-local components only.
- `src/components/*`: shared presentation components used by multiple routes.
- `src/lib/*`: non-UI logic and shared helpers.

Dependency direction (enforced by ESLint — see Enforcement Summary):

- `src/app` can import from `src/components` and `src/lib`.
- `src/components` and `src/lib` must not import from `src/app`.

Promotion rule:

- Start in route-local `_components`.
- Move to `src/components` only after the component is reused by 2+ route areas or is intentionally app-wide.

## Naming Conventions

- Use kebab-case file names (for example: `grouping-members-table.tsx`).
- Keep route entry files standard: `page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`.
- Use the folder name `parts/` for all table internals (cells, columns, and small widgets that belong to one table). This name is the single source of truth: `src/components/table/parts/`, `src/components/table/groupings-table/parts/`, `src/app/admin/_components/admin-table/parts/`, etc.

## Import Conventions

Use alias imports for cross-directory references (enforced by ESLint in
`src/app` — see Enforcement Summary):

- Preferred: `@/app/...`, `@/components/...`, `@/lib/...`
- Allowed relative import: same-directory only (`./...`)
- Avoid in `src/app`: parent-directory relative imports (`../...`)

Why:

- Reduces path recalculation during refactors.
- Makes feature boundaries and ownership explicit.
- Improves retrieval quality for search/LLM tooling.

## Route Pattern Consistency

Inside `src/app`:

- Keep route segments, dynamic segments (`[groupingPath]`), and parallel routes (`@tab`) aligned with Next.js conventions.
- Place UI specific to a segment under that segment's `_components` folder.
- Keep shared app shell pieces (navbar/footer/providers) under `src/components/layout`.

## Tests

Mirror source structure under `tests/` (enforced by `check:structure` — see
Enforcement Summary):

- `src/app/...` -> `tests/app/...`
- `src/components/...` -> `tests/components/...`
- `src/lib/...` -> `tests/lib/...`

Use path names that exactly mirror route folders (`@tab` should stay `@tab`) to avoid drift.

### Automated structure check

Run the mirror-path checker to catch drift early:

```sh
npm run check:structure
```

It fails the build when:

- A test file has no matching source file (orphan test).
- A test directory has no matching source directory (drifted folder).

Intentionally untested source files (e.g. type-only modules, skeletons, pure
route compositions) can be listed in `scripts/test-mirror.allowlist.txt`. Run
with `--verbose` to see the current un-covered files:

```sh
node scripts/check-test-mirror.mjs --verbose
```

Recommended CI usage (already wired in `.github/workflows/ci.yml`):

```sh
npm run lint
npm run check:structure
npm run test:coverage -- --run
```

### Coverage thresholds

`vitest.config.mts` enforces minimum coverage so refactors cannot silently
regress:

- statements: 85%
- branches: 80%
- functions: 85%
- lines: 85%

`src/components/ui/`, `*-skeleton.tsx`, and `src/lib/types.ts` are excluded
from coverage as they have no runtime branches worth measuring.

### Test environment

The vitest setup (`tests/vitest.setup.tsx`) provides a stable test environment:

- A minimal in-memory `window.localStorage` shim so hooks like
  `usehooks-ts` `useLocalStorage` behave correctly under jsdom.
- `localStorage.clear()` is called in `afterEach` to prevent cross-test leakage
  of shared keys (e.g. `columnVisibility`).
- A `createMockProviders` helper that wraps children in `QueryClientProvider`
  and `withNuqsTestingAdapter` for components that depend on those contexts.

Prefer using the in-memory shim over `vi.spyOn(localStorage, 'getItem')`. A
spy that always returns a fixed value defeats `setItem`/state updates and
leads to flaky tests. ESLint blocks the three common variants of this footgun
(`vi.spyOn(localStorage, ...)`, `vi.spyOn(global.localStorage, ...)`, and
`vi.spyOn(window.localStorage, ...)`) in any test file.

### Test lint debt (warnings, not errors)

`tests/` is included in `npm run lint`, but several pre-existing test files
have violations of `testing-library/*` best practices and
`@typescript-eslint/no-explicit-any`. These are downgraded from `error` to
`warn` in `.eslintrc.json` so:

- CI stays green.
- Junior developers see the warnings inline in their editor and learn the
  patterns as they touch the file.
- New test files should aim for zero warnings — reviewers should push back on
  new code that introduces them.

The current warning count (~100) is tracked as a backlog; reduce, do not grow.

## Quick Decision Checklist

Before adding a new file, confirm:

1. Is this route-local (`src/app/**/_components`) or reusable (`src/components`)?
2. Does the name follow existing kebab-case and route file conventions?
3. Are imports alias-based for cross-directory references?
4. If this is table internals, does it follow the same table subfolder pattern used elsewhere?
5. Does the test path mirror the source path exactly, and use `.test.ts` for `.ts` sources / `.test.tsx` for `.tsx` sources?

