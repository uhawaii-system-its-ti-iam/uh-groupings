This is an architectural overview and style guide for the `ui` codebase, 
covering both source layout conventions and React Server/Client Component 
architecture.

# Table of Contents

<!-- TOC -->
* [Table of Contents](#table-of-contents)
* [UI Architecture, part 1](#ui-architecture-part-1)
  * [Goals](#goals)
  * [Enforcement Summary](#enforcement-summary)
  * [Source Layout](#source-layout)
  * [Folder Ownership Rules](#folder-ownership-rules)
  * [Naming Conventions](#naming-conventions)
  * [Import Conventions](#import-conventions)
  * [Route Pattern Consistency](#route-pattern-consistency)
  * [Tests](#tests)
    * [Automated structure check](#automated-structure-check)
    * [Coverage thresholds](#coverage-thresholds)
    * [Test environment](#test-environment)
    * [Test lint debt (warnings, not errors)](#test-lint-debt-warnings-not-errors)
  * [Quick Decision Checklist](#quick-decision-checklist)
* [UI Architecture, part 2](#ui-architecture-part-2)
  * [React Server and Client Component Architecture](#react-server-and-client-component-architecture)
    * [Purpose](#purpose)
  * [Core Architectural Principle](#core-architectural-principle)
    * [Server First, Client Only When Necessary](#server-first-client-only-when-necessary)
  * [Server Component Responsibilities](#server-component-responsibilities)
    * [Appropriate Server Component Responsibilities](#appropriate-server-component-responsibilities)
      * [GOOD](#good)
      * [BAD](#bad)
  * [Client Component Responsibilities](#client-component-responsibilities)
    * [Appropriate Client Component Responsibilities](#appropriate-client-component-responsibilities)
      * [GOOD](#good-1)
      * [BAD](#bad-1)
  * [Decision Tree](#decision-tree)
    * [Should This Be a Server Component?](#should-this-be-a-server-component)
    * [Should This Be a Client Component?](#should-this-be-a-client-component)
  * [Architectural Goal](#architectural-goal)
    * [Minimize Client Component Surface Area](#minimize-client-component-surface-area)
  * [Provider Boundary Pattern](#provider-boundary-pattern)
  * [Data Fetching Rules](#data-fetching-rules)
    * [Preferred Data Fetching Locations](#preferred-data-fetching-locations)
  * [Authorization Rules](#authorization-rules)
  * [Modal and Table Architecture](#modal-and-table-architecture)
  * [LLM-Assisted Development Rules](#llm-assisted-development-rules)
    * [Purpose](#purpose-1)
  * [Rules for LLM-Generated Code](#rules-for-llm-generated-code)
    * [DO](#do)
      * [Prefer Server Components by default](#prefer-server-components-by-default)
      * [Isolate client interactivity](#isolate-client-interactivity)
      * [Keep authorization server-side](#keep-authorization-server-side)
      * [Create narrow client boundaries](#create-narrow-client-boundaries)
      * [Follow existing project structure](#follow-existing-project-structure)
  * [DO NOT](#do-not)
    * [Do not add `"use client"` preemptively](#do-not-add-use-client-preemptively)
    * [Do not move authorization into browser code](#do-not-move-authorization-into-browser-code)
    * [Do not introduce redundant client fetching](#do-not-introduce-redundant-client-fetching)
    * [Do not create global client wrappers unnecessarily](#do-not-create-global-client-wrappers-unnecessarily)
  * [Architectural Consistency Goals](#architectural-consistency-goals)
  * [Review Expectations](#review-expectations)
<!-- TOC -->

# UI Architecture, part 1

Part 1 defines the source layout conventions for `ui/src`.

## Goals

- Keep feature ownership obvious for human developers.
- Make file intent discoverable in 1-2 directory hops.
- Keep import style predictable for editors, code search, and LLM agents.

## Enforcement Summary

The conventions in this document are not just guidelines — most are enforced
automatically and fail the build when violated. New contributors and LLM
agents can rely on these guarantees holding.

| Rule                                                                                  | Enforced by                                                             | Fails on                         |
|---------------------------------------------------------------------------------------|-------------------------------------------------------------------------|----------------------------------|
| `src/app` cannot use parent-relative imports (`../...`)                               | ESLint `no-restricted-imports` in `.eslintrc.json`                      | `npm run lint`                   |
| `src/components` and `src/lib` cannot import from `@/app/*`                           | ESLint `no-restricted-imports` in `.eslintrc.json`                      | `npm run lint`                   |
| Test directories must mirror source directories                                       | `scripts/check-test-mirror.mjs`                                         | `npm run check:structure`        |
| Test files must have a matching source file (no orphans)                              | `scripts/check-test-mirror.mjs`                                         | `npm run check:structure`        |
| Minimum code coverage (85/80/85/85)                                                   | `vitest.config.mts` thresholds                                          | `npm run test:coverage -- --run` |
| Function-component definition style (arrow functions)                                 | ESLint `react/function-component-definition`                            | `npm run lint`                   |
| Single-quote string style, max line length 170                                        | ESLint `@stylistic` rules                                               | `npm run lint`                   |
| No spying on `localStorage`, `global.localStorage`, or `window.localStorage` in tests | ESLint `no-restricted-syntax` (test files)                              | `npm run lint`                   |
| `tests/` directory is linted alongside `src/` and `scripts/`                          | `npm run lint` script (`next lint --dir src --dir tests --dir scripts`) | `npm run lint`                   |

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

---
# UI Architecture, part 2

Part 2 defines the strategy for selecting server vs. client components.

## React Server and Client Component Architecture

### Purpose

This project uses the Next.js App Router architecture with React Server Components (RSCs).

The purpose of this section is to define the architectural rules and expectations for:

- Server Components
- Client Components
- data fetching
- authorization
- browser interactivity
- provider boundaries
- LLM-assisted code generation

This section is intentionally explicit so that:
- junior developers can reason about component placement consistently
- reviewers can identify architectural drift
- AI/LLM coding assistants can generate code that matches the existing architecture

---

## Core Architectural Principle

### Server First, Client Only When Necessary

The default assumption throughout the project is:

> Components are Server Components unless browser-side interactivity is required.

This is the foundational architectural rule for the UI codebase.

---

## Server Component Responsibilities

Server Components are responsible for:

- data fetching
- authorization
- redirects
- route validation
- page composition
- assembling application structure
- passing serializable props downward

Server Components should:
- prefer async rendering
- remain free of browser state
- avoid UI interaction logic
- avoid unnecessary client-side dependencies

Typical locations:
- `app/**/layout.tsx`
- `app/**/page.tsx`

---

### Appropriate Server Component Responsibilities

#### GOOD

- fetch grouping metadata
- validate grouping paths
- check ownership/admin access
- redirect unauthorized users
- assemble layout shells
- load initial page data

#### BAD

- modal state
- dropdown interaction
- table sorting/filtering state
- event handlers
- browser APIs
- React Query hooks
- `useState`
- `useEffect`

---

## Client Component Responsibilities

Client Components exist to support browser interactivity.

A component should only include:

```tsx
'use client';
```

when browser-side functionality is required.

---

### Appropriate Client Component Responsibilities

#### GOOD

- forms
- dialogs
- dropdowns
- tabs
- interactive navigation
- modals
- TanStack tables
- React Query hooks
- URL synchronization
- local browser state
- event handlers

#### BAD

- authorization logic
- redirect decisions
- primary data orchestration
- page-level access control
- unnecessary server data fetching

---

## Decision Tree

### Should This Be a Server Component?

Use a Server Component if the component:

- fetches data
- validates permissions
- performs redirects
- assembles page structure
- only renders props
- does not require browser interaction

If YES:
- keep it server-side
- do not add `"use client"`

---

### Should This Be a Client Component?

Use a Client Component if the component requires:

- `useState`
- `useEffect`
- event handlers
- browser APIs
- interactive UI behavior
- React Query
- TanStack Table
- form state
- modal state
- URL state synchronization

If YES:
- isolate the smallest possible subtree
- add `"use client"` only at the lowest practical level

---

## Architectural Goal

### Minimize Client Component Surface Area

Client rendering should be intentionally scoped.

This project avoids converting large application regions into Client Components unnecessarily.

Preferred pattern:

```tsx
<ServerLayout>
    <InteractiveClientComponent />
</ServerLayout>
```

Avoid:

```tsx
'use client';

export default function EntirePage() {
    ...
}
```

unless the entire page truly requires client-side rendering.

---

## Provider Boundary Pattern

Client-side providers should be isolated into narrowly scoped provider boundaries.

Current examples include:
- React Query providers
- URL state synchronization providers

These providers should:
- remain in dedicated Client Components
- be wrapped around the smallest practical subtree
- not automatically be elevated to the global application root

---

## Data Fetching Rules

### Preferred Data Fetching Locations

Preferred locations:

1. Server layouts
2. Server pages
3. server-side fetcher/helper layers

Avoid:
- duplicating initial fetches client-side
- moving authorization-sensitive fetches into browser components
- unnecessary React Query usage for static server-rendered data

---

## Authorization Rules

Authorization logic belongs on the server.

This includes:
- admin validation
- ownership validation
- redirect decisions
- route access validation

Client Components may:
- display authorization-aware UI
- react to already-computed permissions

Client Components should NOT:
- act as the authoritative enforcement layer

---

## Modal and Table Architecture

The project intentionally isolates highly interactive behavior into Client Components.

Examples:
- tables
- dialogs
- modals
- filters
- dropdown menus

This keeps:
- browser state localized
- server layouts simpler
- hydration boundaries smaller
- architectural reasoning easier

---

## LLM-Assisted Development Rules

### Purpose

LLMs assisting with this repository must preserve the server/client architecture model.

Generated code should prioritize consistency with existing architectural patterns over convenience.

---

## Rules for LLM-Generated Code

### DO

#### Prefer Server Components by default

New pages/layouts should begin as Server Components unless interactivity is required.

---

#### Isolate client interactivity

When browser state is required:
- create a dedicated Client Component
- pass serialized props from the server component

---

#### Keep authorization server-side

Authorization checks should remain:
- in layouts
- in pages
- in server-side helper layers

---

#### Create narrow client boundaries

If only one widget is interactive:
- make only that widget client-side

Do not convert the surrounding page to a Client Component.

---

#### Follow existing project structure

Prefer consistency with:
- existing layouts
- provider boundaries
- fetcher patterns
- table patterns
- modal patterns

over introducing novel architectural styles.

---

## DO NOT

### Do not add `"use client"` preemptively

Adding `"use client"` increases:
- hydration cost
- bundle size
- architectural complexity

---

### Do not move authorization into browser code

Browser code is not the authoritative security layer.

---

### Do not introduce redundant client fetching

If data is already available server-side:
- pass it as props
- avoid unnecessary client refetching

---

### Do not create global client wrappers unnecessarily

Avoid converting:
- root layouts
- major layout trees
- large route structures

into Client Components unless absolutely required.

---

## Architectural Consistency Goals

The long-term goal is to maintain:

| Concern             | Preferred Location         |
|---------------------|----------------------------|
| Authorization       | Server Components          |
| Redirects           | Server Components          |
| Data fetching       | Server Components          |
| Browser state       | Client Components          |
| Forms               | Client Components          |
| Modals              | Client Components          |
| Tables              | Client Components          |
| React Query         | Scoped provider boundaries |
| URL synchronization | Scoped provider boundaries |

---

## Review Expectations

Pull requests should be reviewed for:

- unnecessary `"use client"` usage
- accidental client-boundary expansion
- authorization leakage into browser code
- provider sprawl
- duplicate client/server fetching
- consistency with established patterns

Architectural consistency is considered a primary maintainability concern.

---