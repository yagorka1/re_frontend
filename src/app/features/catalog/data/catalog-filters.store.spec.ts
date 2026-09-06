import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { CatalogFiltersStore } from '@/features/catalog/data/catalog-filters.store';

@Component({
  selector: 'app-catalog-host',
  template: '',
})
class CatalogHost {}

describe('CatalogFiltersStore', () => {
  let store: CatalogFiltersStore;
  let router: Router;

  async function start(url: string): Promise<void> {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'catalog', component: CatalogHost }])],
    });

    await RouterTestingHarness.create(url);

    router = TestBed.inject(Router);
    store = TestBed.inject(CatalogFiltersStore);
  }

  // The store navigates without awaiting, so a test has to let the router settle.
  async function settle(): Promise<void> {
    await new Promise<void>((resolve: () => void) => setTimeout(resolve));
  }

  it('reads the filter state out of the query params', async () => {
    await start('/catalog?q=dress&cat=women-dresses&size=s&size=m&cond=good');

    expect(store.q()).toBe('dress');
    expect(store.category()).toBe('women-dresses');
    expect(store.filters().sizes).toEqual(['s', 'm']);
    expect(store.activeFacetCount()).toBe(4);
  });

  it('writes a change back into the URL, keeping the path', async () => {
    await start('/catalog');

    store.patch({ category: 'men-shoes' });
    await settle();

    expect(router.url).toBe('/catalog?cat=men-shoes');
    expect(store.category()).toBe('men-shoes');
  });

  it('adds and removes a value of a multi-value facet', async () => {
    await start('/catalog?size=s');

    store.toggle('sizes', 'm');
    await settle();
    expect(store.filters().sizes).toEqual(['s', 'm']);

    store.toggle('sizes', 's');
    await settle();
    expect(store.filters().sizes).toEqual(['m']);
  });

  it('returns to the first page when a facet changes', async () => {
    await start('/catalog?page=4');

    store.toggle('colors', 'black');
    await settle();

    expect(store.page()).toBe(1);
    expect(router.url).toBe('/catalog?color=black');
  });

  it('keeps the page when only the page changes', async () => {
    await start('/catalog?color=black');

    store.patch({ page: 2 });
    await settle();

    expect(store.page()).toBe(2);
    expect(store.filters().colors).toEqual(['black']);
  });

  it('moves the sort in and out of relevance with the query', async () => {
    await start('/catalog');

    store.setSearch('wool coat');
    await settle();
    expect(store.sort()).toBe('relevance');
    expect(router.url).toBe('/catalog?q=wool%20coat');

    store.setSearch('   ');
    await settle();
    expect(store.q()).toBeNull();
    expect(store.sort()).toBe('newest');
  });

  it('keeps a sort the user chose when the query changes', async () => {
    await start('/catalog?sort=price_asc');

    store.setSearch('boots');
    await settle();

    expect(store.sort()).toBe('price_asc');
  });

  it('clears the facets but keeps the query', async () => {
    await start('/catalog?q=dress&color=black&price_from=10&city=belgrade');

    store.resetFacets();
    await settle();

    expect(store.q()).toBe('dress');
    expect(store.activeFacetCount()).toBe(0);
    expect(store.isDefault()).toBe(false);
  });
});
