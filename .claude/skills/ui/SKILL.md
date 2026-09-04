---
name: ui
description: Marketplace design system — Tailwind tokens, component patterns (item card, feed, filters, gallery, forms), image handling and mobile-first rules. Use before building any screen or component, when adding colors or spacing, and when configuring Tailwind.
---

# UI and Tailwind

There is deliberately no component library. Everything is built from Tailwind utilities and
in-house primitives in `src/app/shared/ui/`.

## If Tailwind is not installed yet

Check `package.json` for `tailwindcss` and `src/styles.scss` for `@use "tailwindcss"`. If
missing, install Tailwind v4 and import it in `src/styles.scss`. In v4 configuration lives in
CSS via `@theme` — there is no `tailwind.config.js`. Tell the user before adding the
dependency.

## Tokens

Tokens are declared once in `src/styles.scss` under `@theme` and used only as classes.
Arbitrary values (`text-[#1a1a1a]`, `p-[13px]`) mean a token is missing — add the token
instead of the one-off value.

Baseline set for this marketplace:

- **Color**: `brand` (accent, CTAs), `surface` / `surface-muted` (page and card backgrounds),
  `ink` / `ink-muted` (text), `success` (delivered), `warning` (awaiting payment), `danger`
  (dispute, cancelled). Order and listing status colors come from here and nowhere else.
- **Radius**: one card/button radius across the whole app.
- **Spacing**: Tailwind's scale only, no intermediate values.
- Dark mode is not supported yet — do not add `dark:` variants until it is requested.

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
