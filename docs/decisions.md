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
