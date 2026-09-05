# Architecture

How this application is organized. The reasoning behind the choices, and what each one
costs, is in [decisions.md](decisions.md).

## Runtime shape

```
Browser ──▶ Express host (src/server.ts)
              └─ AngularNodeAppEngine  ── SSR render ──▶ HTML + hydration
                          │
                          └─ HttpClient ──▶ re_backend (NestJS REST API)
```

Every component and service runs twice: once on the Node server during SSR, once in the
browser after hydration. Browser-only globals are therefore unavailable during the first
render — see the SSR section in [CLAUDE.md](../CLAUDE.md).

The Express host in `src/server.ts` serves static assets and delegates everything else to
Angular. It is not an API layer: it must not accumulate business endpoints. Anything that
looks like an API belongs in `re_backend`. The one legitimate exception is request-scoped
plumbing SSR needs, such as forwarding the auth cookie into the render.

## Layers

```
src/app/
  core/        # application-wide singletons: auth, interceptors, guards, config, tokens
  shared/      # reusable UI primitives, pipes, directives, utilities
  api/         # GENERATED OpenAPI client — never hand-edited
  features/
    <feature>/
      <feature>.routes.ts   # lazily loaded from app.routes.ts
      pages/                # routed components
      ui/                   # presentational components of this feature
      data/                 # services / stores, the only callers of api/
      model/                # feature types and mappers
```

Dependency rules, in one direction only:

- `features/*` may import from `shared/`, `core/` and `api/`.
- `features/*` must not import from each other. Anything two features need moves to
  `shared/` (presentational) or `core/` (stateful singleton).
- `shared/` knows nothing about `features/` and holds no feature state.
- `api/` imports nothing from the app — it is generated output.
- Only `features/*/data/` calls `api/`. Components never touch the generated client
  directly, so a contract change stays contained in one folder.

Nothing enforces these rules — they hold by convention until an ESLint boundaries rule exists.

Imports outside a file's own directory use the `@/*` path alias (mapped to `src/app/*`)
instead of parent-relative `../` paths; ESLint's `no-restricted-imports` rejects `../`.
Same- or child-directory imports (`./foo`) stay relative.

### `shared/ui` — components vs. widgets

```
shared/ui/
  components/            # atomic, style-only primitives: link, icon, badge, popover...
    controls/            # form controls: input, number-input, checkbox, select...
  widgets/               # composed from components/, own layout and behavior: header,
                         # footer, search-bar, filter-panel...
```

- `components/` holds pieces with no knowledge of layout context and no feature meaning —
  they take primitive inputs (`value`, `variant`, `size`) and emit primitive outputs. A
  component here must make sense standing alone, outside this app.
- `components/controls/` is the subset that holds a value: everything implementing
  `FormValueControl` and bindable with `[formField]`. One control per value type rather than
  one control with a type switch — signal forms bind a single concrete type per control, so
  a numeric field cannot share a `FormValueControl<string>`. Styling common to all of them
  lives in `controls/field/`, applied with `appField` to the native element.
- `widgets/` composes several `components/` (and possibly other `widgets/`) into something
  with actual layout and, sometimes, wiring to `core/` (e.g. the header reading the current
  language). Widgets may still not know about `features/`.
- Where styling only needs to attach behavior to a native element without owning markup
  (`Button`, `Link`, `Field`), prefer a `Directive` over a wrapper `Component`. This keeps
  native semantics (`type`, `disabled`, `href`, `aria-*`, form submission) instead of
  reimplementing them behind a component API. Reach for a `Component` instead once the
  element needs its own template, internal state, or (as with `Input`) integration with the
  forms API.

### Forms

Use Angular's Signal Forms (`@angular/forms/signals`: `form()`, `schema()`, validators,
the `[formField]` directive) for anything beyond a single uncontrolled input — search boxes
included. Custom controls (`components/input`, a future `components/select`, ...) implement
`FormValueControl` with a `model()`, not `ControlValueAccessor`: the two are not meant to be
mixed on the same component, and every form in this app is signal-based, so there is no
reactive-forms interop to support.

The catalog search box is a `components/input` bound into a small `form()` in
`features/catalog/data/`; submitting (or, for instant search, an effect on the field's
value) writes the query into the route's query params per the search-state rule above,
which is what the store actually reads from.

## Data flow

1. A route activates a page component in `features/<f>/pages/`.
2. The page reads signals from its store in `features/<f>/data/`.
3. The store calls the generated client in `api/`, maps DTOs to domain types via
   `model/`, and writes results into signals.
4. Templates render from those signals under `OnPush`. Since the app is zoneless, state
   held outside signals will not trigger a re-render.

Search-shaped state (filters, sorting, page) is not owned by components: it is read from
and written to the route's query params, and the store derives from the route. This keeps
SSR, the back button and shareable links consistent.

### Search state in the URL

The catalog's query params are flat, named after the facets in
[domain.md](domain.md#catalog-filters), and carry reference-data ids rather than labels:

```
q, cat, size, brand, cond, color, price_from, price_to, material, city, sort, page
```

- Multi-value facets repeat the key: `?size=12&size=14`. Angular's `queryParamMap.getAll`
  reads them back as an array.
- `cat` holds one node id at any depth. Ancestors are derived from the tree, never encoded as
  extra params — a `subcat` param would break every saved link the moment a node moves.
- `sort` values: `relevance`, `price_asc`, `price_desc`, `newest`. A param equal to the
  default is omitted, so the canonical URL for the plain feed is `/`.
- Parsing is tolerant: an unknown value is dropped, never an error, because saved searches
  and external links outlive the reference data they were built on.

## State management ladder

Escalate only when the current step stops working, and say so when introducing a dependency:

1. Local `signal()` in the component — state that dies with the view.
2. A `providedIn: 'root'` service exposing readonly signals — the default for feature state.
3. NgRx SignalStore — when a feature has many interdependent slices and transitions
   (checkout, catalog facets) that a plain service no longer expresses clearly.

Global mutable state that is not one of the above does not exist.

## Rendering strategy

`src/app/app.routes.server.ts` decides per route:

- `RenderMode.Prerender` — static marketing and legal pages.
- `RenderMode.Server` — catalog, listing detail, profiles. Content is user- or
  query-dependent but must be indexable.
- `RenderMode.Client` — authenticated, non-indexable areas: chat, checkout, wardrobe.

Getting this wrong is a correctness bug, not a performance detail: prerendering a
personalized page bakes one user's data into a shared HTML file.

## Testing

Vitest via `@angular/build:unit-test`. Components are tested through `TestBed` against
rendered output rather than internals; stores are tested as plain classes with a faked
`api/` client. There is no e2e runner configured yet — the `playwright` MCP server is
available for interactive checks in the meantime.
