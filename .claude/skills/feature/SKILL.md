---
name: feature
description: Scaffold a new feature under src/app/features following project conventions — folder layout, lazily loaded routes, pages, a signal-based data layer, types and tests. Use when asked to add an application area (catalog, listing detail, chat, profile, checkout) or a new top-level route.
---

# New feature

Structure and dependency rules come from
[docs/architecture.md](../../../docs/architecture.md).

## 1. Scope it first

Before creating files, settle:

- Is this really a separate feature, or a page inside an existing one? Chat opened from a
  listing belongs to `chat`, not to a new feature.
- Which routes are needed — list, detail, nested?
- Does it need server data? If so, check `src/app/api/` for the endpoint. Missing there →
  run `/api-sync`. Missing on the backend too → say so and stop. Do not invent a contract.

## 2. Layout

```
src/app/features/<feature>/
  <feature>.routes.ts
  pages/<page>/<page>.ts|.html|.scss|.spec.ts
  ui/<component>/...
  data/<feature>-store.ts    (or <feature>.service.ts)
  model/<feature>.model.ts
```

Wire it up in `src/app/app.routes.ts`:

```ts
{
  path: 'catalog',
  loadChildren: () => import('./features/catalog/catalog.routes').then((m) => m.catalogRoutes),
}
```

`<feature>.routes.ts` contains `loadComponent` entries only — no `NgModule`.

Do not import from another feature. Shared presentational pieces go to `shared/`, shared
singletons to `core/`.

## 3. Page component

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-catalog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {
  private readonly store = inject(CatalogStore);

  protected readonly items = this.store.items;
  protected readonly isLoading = this.store.isLoading;
}
```

Required: `OnPush`, `inject()`, signal-based `input()` / `output()`, `@if` / `@for` in
templates. The app is zoneless — state outside a signal will not re-render.

## 4. Data layer

Default to a service exposing readonly signals:

```ts
@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(ListingsApi);

  private readonly _items = signal<Listing[]>([]);
  readonly items = this._items.asReadonly();
  readonly isLoading = signal(false);
}
```

This layer is the only caller of `src/app/api/`. Map DTOs to domain types in `model/` rather
than passing wire shapes into templates.

Reach for NgRx SignalStore only when a feature has many interdependent slices and
transitions (checkout, catalog facets) — and tell the user before adding the dependency.

Anything search-shaped — filters, sorting, paging — is read from and written to route query
params, not held in the store.

## 5. SSR

The page renders on the server. No `window`, `document` or `localStorage` in fields,
constructors or `ngOnInit` — use `afterNextRender()` or a platform check.

Add the route to `src/app/app.routes.server.ts` and pick a render mode deliberately:
`Server` for indexable dynamic pages, `Prerender` for static ones, `Client` for
authenticated areas. Prerendering a personalized page bakes one user's data into shared HTML.

## 6. Styling

Tailwind utilities in the template; add a `.scss` file only for what utilities cannot
express. Tokens and component patterns are in the `/ui` skill.

## 7. Finish

- Add a spec for the page covering loading, empty and loaded states.
- Run `npm test` and `npm run build`.
- List the created files for the user and name anything deliberately left out.
