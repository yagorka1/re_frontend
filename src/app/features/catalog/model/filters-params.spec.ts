import { ParamMap, Params, convertToParamMap } from '@angular/router';

import { CatalogFilterState, EMPTY_CATALOG_FILTERS } from '@/features/catalog/model/filters';
import {
  parseCatalogFilters,
  serializeCatalogFilters,
} from '@/features/catalog/model/filters-params';

function parse(params: Params): CatalogFilterState {
  const map: ParamMap = convertToParamMap(params);
  return parseCatalogFilters(map);
}

describe('parseCatalogFilters', () => {
  it('returns the default state for an empty query string', () => {
    expect(parse({})).toEqual(EMPTY_CATALOG_FILTERS);
  });

  it('reads every facet', () => {
    const state: CatalogFilterState = parse({
      q: 'linen dress',
      cat: 'women-dresses',
      size: ['s', 'm'],
      brand: 'cos',
      cond: ['good', 'very_good'],
      color: 'beige',
      price_from: '10',
      price_to: '45.5',
      material: 'linen',
      city: 'belgrade',
      sort: 'price_asc',
      page: '3',
    });

    expect(state).toEqual({
      q: 'linen dress',
      category: 'women-dresses',
      sizes: ['s', 'm'],
      brands: ['cos'],
      conditions: ['good', 'very_good'],
      colors: ['beige'],
      priceFrom: 10,
      priceTo: 45.5,
      materials: ['linen'],
      city: 'belgrade',
      sort: 'price_asc',
      page: 3,
    });
  });

  it('drops unknown conditions and sorts instead of failing', () => {
    const state: CatalogFilterState = parse({ cond: ['good', 'pristine'], sort: 'cheapest' });

    expect(state.conditions).toEqual(['good']);
    expect(state.sort).toBe('newest');
  });

  it('drops blank and duplicate values', () => {
    const state: CatalogFilterState = parse({ q: '  ', size: ['s', 's', ' ', 'm'] });

    expect(state.q).toBeNull();
    expect(state.sizes).toEqual(['s', 'm']);
  });

  it('drops prices and pages that are not usable numbers', () => {
    const state: CatalogFilterState = parse({
      price_from: 'cheap',
      price_to: '-5',
      page: '0',
    });

    expect(state.priceFrom).toBeNull();
    expect(state.priceTo).toBeNull();
    expect(state.page).toBe(1);
  });

  it('defaults to relevance with a query and to newest without one', () => {
    expect(parse({ q: 'dress' }).sort).toBe('relevance');
    expect(parse({}).sort).toBe('newest');
  });

  it('falls back to newest when relevance is asked for without a query', () => {
    expect(parse({ sort: 'relevance' }).sort).toBe('newest');
  });
});

describe('serializeCatalogFilters', () => {
  it('writes nothing for the default state', () => {
    expect(serializeCatalogFilters(EMPTY_CATALOG_FILTERS)).toEqual({});
  });

  it('omits a sort equal to the default and the first page', () => {
    const params: Params = serializeCatalogFilters({
      ...EMPTY_CATALOG_FILTERS,
      q: 'dress',
      sort: 'relevance',
      page: 1,
    });

    expect(params).toEqual({ q: 'dress' });
  });

  it('repeats the key for multi-value facets', () => {
    const params: Params = serializeCatalogFilters({
      ...EMPTY_CATALOG_FILTERS,
      sizes: ['s', 'm'],
    });

    expect(params).toEqual({ size: ['s', 'm'] });
  });
});

describe('the parse and serialise round trip', () => {
  const states: readonly CatalogFilterState[] = [
    EMPTY_CATALOG_FILTERS,
    { ...EMPTY_CATALOG_FILTERS, q: 'wool coat', sort: 'relevance' },
    {
      ...EMPTY_CATALOG_FILTERS,
      q: 'boots',
      category: 'men-boots',
      sizes: ['42', '43'],
      brands: ['nike'],
      conditions: ['very_good'],
      colors: ['black'],
      priceFrom: 20,
      priceTo: 120,
      materials: ['leather'],
      city: 'novi-sad',
      sort: 'price_desc',
      page: 2,
    },
  ];

  it.each(states)('leaves the state unchanged', (state: CatalogFilterState) => {
    expect(parse(serializeCatalogFilters(state))).toEqual(state);
  });
});
