# AGENTS.md

## Package Manager

This repository uses **Bun**.

For one-off CLIs, always use `bunx` instead of `npx`.

Examples:

```bash
bunx @sveltejs/mcp svelte-autofixer ...
bunx convex codegen
```

Never use `npx`.

---

# Design System (`DESIGN.html`)

**Always read `DESIGN.html` at the repository root before any UI, styling, layout, or copy work.**

Do not rely on memory or assumptions about colors, typography, spacing, or component patterns.

## When to read it

Read `DESIGN.html` when you:

- create or edit Svelte pages or components
- change `src/routes/layout.css` or global styles
- build marketing sections, forms, tables, or navigation
- choose colors, fonts, radii, or spacing
- write user-facing copy tone or structure

## What to follow

1. **Read the full file** (or the sections relevant to the task: Principles, Color, Typography, Scale, Components, Component reuse, Anti-patterns).
2. **Svelte app tokens** live in `src/routes/layout.css` — they implement `DESIGN.html`; do not invent parallel token names.
3. **Section 06 · Component reuse** — reuse `src/shared/components/ui/`, feature components, and shadcn-svelte; use `Link` from `link/link.svelte` for in-app routes (not raw `<a>`).
4. **Tailwind / shadcn** — use existing semantic classes (`bg-background`, `text-primary`, `border-border`, etc.) or `var(--…)` from `:root` in `layout.css`; write layout and components with Tailwind in `.svelte` files, not custom CSS component classes unless `DESIGN.html` explicitly requires it.
5. **Section 09** — quick LLM checklist; still read the detailed sections above it for real work.

If `DESIGN.html` and existing code disagree, treat **`DESIGN.html` as the source of truth** and align the implementation unless the user directs otherwise.

---

# i18n Navigation (Paraglide)

This app uses **Paraglide** with locale-prefixed public URLs (`/sr/...`) and unprefixed admin URLs (`/admin/...`). `urlPatterns` define the rules — they do **not** auto-localize links or `goto` calls.

**Always use canonical paths in app code** (e.g. `/demo`, `/login`, `/admin/users`). Never hardcode locale prefixes like `/sr/demo`.

## Utilities (`src/shared/utils/app-navigation.ts`)

```ts
import { appHref, appGoto } from '@/shared/utils/app-navigation';

appHref('/demo'); // → `/demo` (en) or `/sr/demo` (sr)
appGoto('/login'); // programmatic navigate with locale applied
```

- **`appHref(href)`** — `resolve(localizeHref(href))` for declarative links.
- **`appGoto(href, opts?)`** — `goto(appHref(href), opts)` for programmatic navigation.

Do **not** call `localizeHref` or `resolve(localizeHref(...))` directly at call sites — use these helpers so locale logic stays in one place.

Do **not** re-export or shadow SvelteKit's `goto` from `$app/navigation`.

## Declarative links

Prefer shared components that already call `appHref` internally:

| Use                            | For                                                 |
| ------------------------------ | --------------------------------------------------- |
| `Link` from `link/link.svelte` | In-app routes (default for navigation)              |
| `Button` with `href`           | Button-styled links                                 |
| `Breadcrumb.Link`              | Internal breadcrumb paths (paths starting with `/`) |

Use raw `<a>` only for **external** URLs (`https://`, `mailto:`, `tel:`). Never run those through `appHref`.

## Programmatic navigation

| Use                               | For                                                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appGoto('/path')`                | Redirect after auth, form success, delete, logout, etc.                                                                                               |
| Raw `goto` from `$app/navigation` | URLs already localized by Paraglide (e.g. `decision.redirectUrl` in `+layout.svelte`) or intentional current-path edits (e.g. stripping query params) |

Never use `goto(resolve(...))` for internal routes — use `appGoto(...)` instead.

## Related Paraglide pieces (do not duplicate)

| Piece                                                 | Role                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `urlPatterns` + `routeStrategies` (`vite.config.ts`)  | Rule book for URL shape per locale                                           |
| `paraglideMiddleware` (`hooks.server.ts`)             | SSR locale detection and redirects                                           |
| `reroute` (`hooks.ts`)                                | Maps localized URLs to SvelteKit route files                                 |
| `shouldRedirect` / `syncLocaleUrl` (`+layout.svelte`) | Client safety net after navigation — not a substitute for `appHref` on links |

When adding new routes or links, verify behavior for both `en` (unprefixed) and `sr` (`/sr/` prefix) on public pages, and that admin paths stay unprefixed.

---

# Svelte MCP Workflow

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation.

Always use the MCP tools systematically instead of relying on memory alone.

## Available MCP Tools

### 1. `list-sections`

Use this FIRST when working with Svelte or SvelteKit.

This returns available documentation sections with:

- titles
- use cases
- paths

You must analyze the returned sections and identify ALL potentially relevant documentation before proceeding.

Do not skip this step.

---

### 2. `get-documentation`

After using `list-sections`, fetch ALL documentation sections relevant to the task.

Prioritize:

- official patterns
- idiomatic Svelte 5 approaches
- SSR compatibility
- accessibility
- performance implications
- recommended architecture patterns

Never rely on assumptions when documentation is available.

---

### 3. `svelte-autofixer`

Whenever writing or modifying Svelte code:

1. Run the autofixer
2. Review all warnings and suggestions
3. Apply meaningful improvements
4. Repeat until no relevant issues remain

Always run with Bun:

```bash
bunx @sveltejs/mcp svelte-autofixer ./path/to/Component.svelte --svelte-version 5
```

Never use `npx`.

Do not finalize Svelte code before running the autofixer.

---

# Engineering Philosophy

This project is treated as a reusable long-term architecture foundation, not a one-off application.

Assume components, utilities, patterns, and modules will later be:

- copied into future projects
- extracted into shared libraries
- extended by other developers
- connected to different backends
- styled differently
- reused in unrelated domains

Optimize for:

1. Reusability
2. Maintainability
3. Developer experience (DX)
4. Architectural clarity
5. Performance
6. Simplicity
7. Short-term implementation speed

Never optimize for quick hacks that create future coupling.

---

# Architecture Standards

Before implementing code, evaluate:

- portability
- scalability
- composability
- separation of concerns
- backend independence
- API ergonomics
- future extensibility
- long-term maintainability

Prefer:

- composition over inheritance
- explicit APIs
- backend-agnostic abstractions
- dependency injection where appropriate
- low coupling
- high cohesion
- predictable state flow
- modular design
- reusable primitives

Avoid:

- project-specific assumptions
- hardcoded business logic
- tightly coupled components
- hidden dependencies
- singleton-heavy architecture
- app-specific naming
- deeply nested reactive chains

Business logic should remain separable from UI whenever practical.

---

# Convex Integration Rules

Do not tightly couple UI components to Convex.

Avoid embedding:

- Convex-specific assumptions
- database schema assumptions
- direct mutation/query logic in reusable UI
- app-specific backend logic
- hardcoded endpoints

Prefer:

- adapters
- composables
- injected data sources
- backend-independent interfaces

Components should remain usable even if Convex is later replaced.

---

# Svelte 5 Standards

Use idiomatic Svelte 5 patterns.

Prefer:

- runes where appropriate
- local reasoning
- explicit data flow
- SSR-friendly patterns
- progressive enhancement
- composable components
- minimal reactive complexity

Avoid:

- React-style architecture patterns
- unnecessary stores
- excessive derived state
- lifecycle misuse
- prop drilling caused by poor composition
- over-engineered abstractions
- unnecessary reactivity

Keep components understandable and easy to extend.

## Markup conditionals

In `.svelte` templates, prefer `{#if}` / `{:else}` for UI branches — labels, badges, alternate components, loading vs loaded text.

```svelte
<!-- Prefer -->
{#if active}
	<Badge variant="success">Active</Badge>
{:else}
	<Badge variant="secondary">Inactive</Badge>
{/if}

<!-- Avoid in markup -->
<Badge variant={active ? 'success' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>
```

Ternaries are fine in `<script>` (e.g. `$derived`, handlers). Attribute-only bindings (`aria-invalid`, `type`, `aria-current`) may stay ternary when `{#if}` would duplicate the whole element.

## Loading states

For `isLoading`, `isPending`, or similar in markup, use `<Spinner />` from `@/shared/components/ui/spinner/spinner.svelte` — never placeholder text like `"..."` or `"…"`.

```svelte
{#if isLoading}
	<Spinner class="size-5" />
{:else}
	{count}
{/if}
```

Use `Skeleton` for full-row or layout placeholders; use `Spinner` for inline values, buttons, and compact loading slots.

---

# DX Standards

Code should feel excellent to work with.

Prioritize:

- strong typing
- intuitive APIs
- self-documenting code
- low cognitive overhead
- clean naming
- minimal boilerplate
- safe defaults
- easy debugging
- consistent structure
- maintainable abstractions

Avoid cleverness that harms readability.

Prefer APIs that are understandable without documentation.

---

# Performance Standards

Default to production-grade performance patterns.

Prefer:

- minimal reactive cascades
- low hydration cost
- SSR when beneficial
- lazy loading where appropriate
- stable derived state
- efficient rendering
- scalable state management
- efficient large-list rendering
- minimal unnecessary client-side work

Avoid premature micro-optimization.

Prioritize architectural performance over trivial optimizations.

---

# Reusability Standards

Assume every exported component may become part of a shared internal library.

Therefore:

- keep dependencies minimal
- avoid hidden assumptions
- expose extensible APIs
- prefer configuration over hardcoding
- support composition
- design for portability
- avoid app-locked patterns

When reasonable, design components like reusable framework primitives rather than app-specific implementations.

---

# Mandatory Review Before Finalizing

Before finalizing any implementation, perform an internal review.

Evaluate:

- Is this reusable?
- Is this portable?
- Is this overly coupled to the current project?
- Is the abstraction level correct?
- Is the API ergonomic?
- Is this production-ready?
- Is accessibility handled properly?
- Is performance acceptable at scale?
- Is there unnecessary complexity?
- Is there unnecessary abstraction?
- Will this still make sense in 12 months?
- Could this be copied into another project cleanly?

If a significantly better architecture or implementation exists, refactor before finalizing.

Do not stop at “working”.

Aim for production-grade, reusable, maintainable code.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `src/convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
