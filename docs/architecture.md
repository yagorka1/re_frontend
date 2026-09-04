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
