# Decisions

Short log of choices that constrain the code, and the cost each one carries. Add an entry
when a decision would otherwise be re-litigated later; strike it through and add a new one
when it changes.

**Tailwind, no component library.** The item card, feed and filter panel are the product, and
restyling Material or PrimeNG into a marketplace identity fights their theming. Cost:
accessibility is entirely on us — focus traps, ARIA, keyboard handling. Complex widgets
(date picker, combobox, bottom sheet) have to be built.

**Signals + services; SignalStore only when a service stops scaling.** The app is zoneless, so
signals are the state model, not an option. Escalate local `signal()` → root service with
readonly signals → NgRx SignalStore (checkout, catalog facets). Cost: state kept outside a
signal silently fails to re-render, and libraries assuming `zone.js` need wrapping.

**Generated OpenAPI client in `src/app/api/`.** Hand-written request types drift from the
NestJS DTOs and the drift shows up at runtime. Cost: a generation step between two repos,
noisy diffs on generated code, and incomplete Swagger decorators on the backend quietly
produce wrong types here.

**Catalog search state lives in the URL.** SSR renders from the request alone, links have to
reproduce a result set, and the back button has to work — a client-side store gives none of
that. Cost: query-param encoding for arrays and ranges is real work, and every filter change
is a navigation (use `replaceUrl` for sliders or the history stack fills up).

**One-way imports: `features/*` → `shared`/`core`/`api`, never feature → feature.** Nothing
enforces this yet, but ESLint is now wired up (`eslint.config.js`), so the fix when the first
cross-feature import appears is a boundaries rule rather than a new toolchain.

**Quality gates are split by speed: hooks locally, the full suite in CI.** `pre-commit` only
touches staged files (ESLint `--fix` + Prettier via lint-staged), `commit-msg` runs commitlint,
`pre-push` runs `typecheck` and the tests. Everything slower — `format:check`, project-wide
lint, the SSR build — lives in `.github/workflows/ci.yml`. Cost: a hook that grows past a
second or two will get bypassed with `--no-verify`, so new checks default to CI; and CI can
still go red on something the hooks let through (template type errors, budget overruns),
because `tsc --noEmit` does not type-check Angular templates — only the build does.

**Conventional Commits, enforced on messages and on pull request titles.** Squash merges take
the PR title as the commit message, so checking only the commits would leave the history that
actually lands unchecked. Cost: `--no-verify` and the GitHub web editor both bypass the local
hook, which is why CI re-checks both.

**SSR render mode is chosen per route, not defaulted.** The scaffold prerenders `**`, which is
wrong here — prerendering a personalized page bakes one user's data into shared HTML.

**Tailwind's entry point is a `.css` file, not `styles.scss`.** Sass fails to resolve a bare
`@import "tailwindcss"`, so `src/tailwind.css` (plain CSS, `@tailwindcss/postcss` via
`.postcssrc.json`) carries the import and the `@theme` tokens, and `src/styles.scss` stays for
plain global SCSS. Cost: two global stylesheets in `angular.json` instead of one, and a token
added to `@theme` must go in `tailwind.css`, never `styles.scss`.

**Transloco for i18n, translations loaded inline instead of over HTTP.** The app ships three
languages (English, Serbian, Russian) and switches at runtime, so `@angular/localize`'s
build-time approach doesn't fit; Transloco's signal-based API matches the rest of the state
model. Its `TranslocoHttpLoader` fetches `/i18n/<lang>.json` at runtime, which needs an
absolute URL during SSR — a custom `TranslocoLoader` that dynamically `import()`s the JSON
instead sidesteps that entirely and behaves identically on the server and in the browser.
Cost: every language ships in the initial bundle as a lazy chunk rather than being fetched
on demand, and a fourth language means another entry in `transloco.config.ts`'s loader map,
not just a new asset file. `LanguageService` persists the choice to `localStorage`, mirroring
`ThemeService`; there is no server-side detection (cookie or `Accept-Language`) yet, so SSR
always renders the `en` default and a returning visitor's stored language applies after
hydration.

**Dark mode is a manual class toggle, defaulting to light.** A `@custom-variant dark` keyed
off `.dark` on `<html>` lets users opt into dark mode explicitly; `ThemeService` persists the
choice to `localStorage` and an inline script in `index.html` applies it before first paint to
avoid a flash. No `prefers-color-scheme` detection — a first-time visitor always gets light.
Cost: every color token needs a `.dark { }` override in `tailwind.css`, not a `dark:` utility
per usage — a token missing its dark value silently reads the light value.
