import { Condition } from '@/features/catalog/model/facet';

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

export const SORT_OPTIONS: readonly SortOption[] = [
  'relevance',
  'price_asc',
  'price_desc',
  'newest',
];

export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

// The complete catalog search state. It lives in the URL, not in a component: see
// docs/architecture.md#search-state-in-the-url for the parameter scheme.
export interface CatalogFilterState {
  readonly q: string | null;
  readonly category: string | null;
  readonly sizes: readonly string[];
  readonly brands: readonly string[];
  readonly conditions: readonly Condition[];
  readonly colors: readonly string[];
  readonly priceFrom: number | null;
  readonly priceTo: number | null;
  readonly materials: readonly string[];
  readonly city: string | null;
  readonly sort: SortOption;
  readonly page: number;
}

// Multi-value facets, so callers can toggle one without a switch over every facet name.
export type MultiFacetKey = 'sizes' | 'brands' | 'conditions' | 'colors' | 'materials';

export const EMPTY_CATALOG_FILTERS: CatalogFilterState = {
  q: null,
  category: null,
  sizes: [],
  brands: [],
  conditions: [],
  colors: [],
  priceFrom: null,
  priceTo: null,
  materials: [],
  city: null,
  sort: 'newest',
  page: 1,
};

// Relevance can only be computed against a query, so the default sort follows the query.
export function defaultSortFor(q: string | null): SortOption {
  return q === null ? 'newest' : 'relevance';
}

// `relevance` without a query is meaningless, which happens whenever a saved search or an
// inbound link keeps the sort but drops the query. Applied on both read and write so a state
// survives a round trip through the URL unchanged.
export function resolveSort(sort: SortOption, q: string | null): SortOption {
  return sort === 'relevance' && q === null ? defaultSortFor(q) : sort;
}
