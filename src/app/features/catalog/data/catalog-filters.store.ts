import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';

import {
  CatalogFilterState,
  MultiFacetKey,
  SortOption,
  defaultSortFor,
} from '@/features/catalog/model/filters';
import {
  parseCatalogFilters,
  serializeCatalogFilters,
} from '@/features/catalog/model/filters-params';

// The single owner of catalog search state. Components read its signals and call its methods;
// none of them touches the route, so the URL stays the one place the state lives.
@Injectable({ providedIn: 'root' })
export class CatalogFiltersStore {
  private readonly router: Router = inject(Router);
  // The root route on purpose: query params are a property of the whole URL, not of a
  // segment, so a root-provided store reads exactly what the catalog page sees.
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  public readonly filters: Signal<CatalogFilterState> = toSignal(
    this.route.queryParamMap.pipe(map((params: ParamMap) => parseCatalogFilters(params))),
    { initialValue: parseCatalogFilters(this.route.snapshot.queryParamMap) },
  );

  public readonly q: Signal<string | null> = computed(() => this.filters().q);
  public readonly category: Signal<string | null> = computed(() => this.filters().category);
  public readonly sort: Signal<SortOption> = computed(() => this.filters().sort);
  public readonly page: Signal<number> = computed(() => this.filters().page);

  // Relevance is only offered while there is something to be relevant to.
  public readonly isRelevanceAvailable: Signal<boolean> = computed(() => this.filters().q !== null);

  public readonly isDefault: Signal<boolean> = computed(
    () => Object.keys(serializeCatalogFilters(this.filters())).length === 0,
  );

  // How many facet values are active, for the "reset" affordance and the mobile trigger
  // badge. The query and the sort are not filters and do not count.
  public readonly activeFacetCount: Signal<number> = computed(() => {
    const state: CatalogFilterState = this.filters();

    return (
      state.sizes.length +
      state.brands.length +
      state.conditions.length +
      state.colors.length +
      state.materials.length +
      (state.category === null ? 0 : 1) +
      (state.city === null ? 0 : 1) +
      (state.priceFrom === null && state.priceTo === null ? 0 : 1)
    );
  });

  public patch(changes: Partial<CatalogFilterState>): void {
    this.navigate(this.apply(changes));
  }

  public toggle(facet: MultiFacetKey, id: string): void {
    const current: readonly string[] = this.filters()[facet];
    const next: readonly string[] = current.includes(id)
      ? current.filter((value: string) => value !== id)
      : [...current, id];

    this.patch({ [facet]: next });
  }

  public setSearch(q: string): void {
    const trimmed: string = q.trim();
    const value: string | null = trimmed.length > 0 ? trimmed : null;

    // The sort follows the query in and out of relevance unless the user picked one.
    const sort: SortOption =
      this.filters().sort === defaultSortFor(this.filters().q)
        ? defaultSortFor(value)
        : this.filters().sort;

    this.patch({ q: value, sort });
  }

  // Clears the facets but keeps the query: the reset button sits inside the filter block.
  public resetFacets(): void {
    this.patch({
      category: null,
      sizes: [],
      brands: [],
      conditions: [],
      colors: [],
      priceFrom: null,
      priceTo: null,
      materials: [],
      city: null,
    });
  }

  private apply(changes: Partial<CatalogFilterState>): CatalogFilterState {
    const next: CatalogFilterState = { ...this.filters(), ...changes };

    // Any change other than paging returns to page one: the old offset points into a
    // different result set.
    const pagingOnly: boolean = Object.keys(changes).every((key: string) => key === 'page');

    return pagingOnly ? next : { ...next, page: 1 };
  }

  private navigate(state: CatalogFilterState): void {
    // Rewriting the query params of the current URL rather than `navigate([], {relativeTo})`:
    // the store is root-provided, so its ActivatedRoute is the root one and a relative
    // navigation from it would resolve away from the page the user is on.
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams = serializeCatalogFilters(state);

    void this.router.navigateByUrl(tree);
  }
}
