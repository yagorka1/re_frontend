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
enforces this. The first cross-feature import will look harmless and the boundary will erode;
if that starts, add an ESLint boundaries rule.

**SSR render mode is chosen per route, not defaulted.** The scaffold prerenders `**`, which is
wrong here — prerendering a personalized page bakes one user's data into shared HTML.
