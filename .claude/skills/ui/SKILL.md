---
name: ui
description: Marketplace design system — Tailwind tokens, component patterns (item card, feed, filters, gallery, forms), image handling and mobile-first rules. Use before building any screen or component, when adding colors or spacing, and when configuring Tailwind.
---

# UI and Tailwind

There is deliberately no component library. Everything is built from Tailwind utilities and
in-house primitives in `src/app/shared/ui/`.

## If Tailwind is not installed yet

Check `package.json` for `tailwindcss`. If missing, install Tailwind v4 plus
`@tailwindcss/postcss` and `postcss`, add a root `.postcssrc.json` with the
`@tailwindcss/postcss` plugin, and give it a plain-CSS entry point (`src/tailwind.css` with
`@import 'tailwindcss';`) listed in `angular.json`'s `styles` array alongside
`src/styles.scss`. Tailwind's entry point must stay a `.css` file — Sass tries to resolve a
bare `@import "tailwindcss"` as a partial and fails, so it can't live in `styles.scss`. In v4
configuration lives in CSS via `@theme` — there is no `tailwind.config.js`. Tell the user
before adding the dependency.

## Tokens

Tokens (and dark-mode overrides) are declared once in `src/tailwind.css` under `@theme` —
that's the only file Tailwind's PostCSS plugin scans for it — and used only as classes.
`src/styles.scss` is for plain global CSS (e.g. `body` defaults) that reads those tokens via
`var(--color-*)`, not for declaring them. Arbitrary values (`text-[#1a1a1a]`, `p-[13px]`) mean
a token is missing — add the token instead of the one-off value.

Baseline set for this marketplace:

- **Color**: `brand` (accent, CTAs), `surface` / `surface-muted` (page and card backgrounds),
  `ink` / `ink-muted` (text), `success` (delivered), `warning` (awaiting payment), `danger`
  (dispute, cancelled). Order and listing status colors come from here and nowhere else.
- **Radius**: one card/button radius across the whole app (`radius-card`).
- **Spacing**: Tailwind's scale only, no intermediate values.
- **Dark mode** is class-based (`@custom-variant dark (&:where(.dark, .dark *));` in
  `tailwind.css`, toggled by `.dark` on `<html>`), a manual opt-in rather than
  `prefers-color-scheme`-driven — a first visit is always light. `ThemeService`
  (`src/app/core/theme/theme.service.ts`) owns the signal, persists the choice to
  `localStorage`, and toggles the class; `<app-theme-toggle>` in `shared/ui` is the switcher.
  An inline script in `src/index.html` applies a stored `dark` choice before first paint to
  avoid a flash. Never gate a token behind `dark:` — redefine the same custom property inside
  the `.dark { }` block in `tailwind.css` so every utility using the token repaints
  automatically.

The catalog mockups in `docs/design/` are the visual source for the palette. They use raw
CSS variables; the token each one becomes:

| Mockup variable                        | Token                             |
| -------------------------------------- | --------------------------------- |
| `--terracotta` / `--terracotta-deep`   | `brand` / `brand-strong`          |
| `--bg` / `--surface`                   | `surface-muted` / `surface`       |
| `--ink` / `--ink-soft` / `--ink-faint` | `ink` / `ink-muted` / `ink-faint` |
| `--line`                               | `border`                          |
| `--sage` / `--sage-tint`               | `success` / `success-muted`       |

Type is Manrope everywhere, Instrument Serif italic for the wordmark only. Colors are in
`oklch()` — keep them there rather than converting to hex.

## Component patterns

**Item card** — the most reused component in the app; it belongs in `shared/ui`. 3:4 photo,
brand, size, price, favorite button overlaid on the image. The whole card is a link, but the
favorite button must not trigger navigation.

**Feed** — CSS grid, mobile-first: 2 columns on phones, 3–4 on tablets, 5–6 on desktop.
Loading skeletons must match card height or the layout jumps.

**Filters** — a sidebar on desktop, a bottom sheet on mobile. Values are read from and
written to route query params; the filter component is controlled and holds no query state
of its own.

**Listing gallery** — horizontal scroll-snap on mobile, thumbnail grid on desktop.

**Forms** — Angular reactive forms, errors rendered under the field, submit disabled while
the request is in flight. The sell wizard is one step per screen on mobile.

**Empty states** are required for the feed, favorites, chat and wardrobe: icon, one line of
explanation, one action.

## Images

Product photos dominate page weight:

- always `NgOptimizedImage` with explicit `width` / `height`, or the page shifts (CLS);
- `priority` on the first above-the-fold image only;
- fixed aspect-ratio container plus `object-cover`;
- everything below the fold stays lazy (the `NgOptimizedImage` default).

## Markup rules

- Mobile-first: base classes target phones, desktop comes via `sm:` / `md:` / `lg:`.
- Interactive targets are at least 44px tall on touch devices.
- Template control flow is `@if` / `@for` (always with `track`) — never `*ngIf` / `*ngFor`.
- Semantics and accessibility are on us, since no library provides them: a button is
  `<button>`, a link is `<a>`, icon-only buttons (favorite, close) require `aria-label`,
  and modals need focus handling.
- Do not collapse long class lists into `@apply`. A repeated block means a component is
  missing from `shared/ui`.
