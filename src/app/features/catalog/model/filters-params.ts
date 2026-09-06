import { ParamMap, Params } from '@angular/router';

import { isCondition } from '@/features/catalog/model/facet';
import {
  CatalogFilterState,
  SortOption,
  defaultSortFor,
  isSortOption,
  resolveSort,
} from '@/features/catalog/model/filters';

// Parsing is deliberately tolerant: an unknown or malformed value is dropped, never an error.
// Saved searches and external links outlive the reference data they were built on.
//
// Only closed sets — sort and condition — are validated here. Ids of reference data (brand,
// size, colour, material, city) pass through untouched, because this layer does not know the
// catalogue; stale ids fall away where the options are rendered.
export function parseCatalogFilters(params: ParamMap): CatalogFilterState {
  const q: string | null = readSingle(params, 'q');
  const sortParam: string | null = readSingle(params, 'sort');
  const sort: SortOption =
    sortParam !== null && isSortOption(sortParam) ? sortParam : defaultSortFor(q);

  return {
    q,
    category: readSingle(params, 'cat'),
    sizes: readMulti(params, 'size'),
    brands: readMulti(params, 'brand'),
    conditions: readMulti(params, 'cond').filter(isCondition),
    colors: readMulti(params, 'color'),
    priceFrom: readPrice(params, 'price_from'),
    priceTo: readPrice(params, 'price_to'),
    materials: readMulti(params, 'material'),
    city: readSingle(params, 'city'),
    sort: resolveSort(sort, q),
    page: readPage(params),
  };
}

// Default values are never written, so the canonical URL of the plain feed is `/`.
export function serializeCatalogFilters(state: CatalogFilterState): Params {
  const params: Params = {};

  writeSingle(params, 'q', state.q);
  writeSingle(params, 'cat', state.category);
  writeMulti(params, 'size', state.sizes);
  writeMulti(params, 'brand', state.brands);
  writeMulti(params, 'cond', state.conditions);
  writeMulti(params, 'color', state.colors);
  writeSingle(params, 'price_from', numberToParam(state.priceFrom));
  writeSingle(params, 'price_to', numberToParam(state.priceTo));
  writeMulti(params, 'material', state.materials);
  writeSingle(params, 'city', state.city);

  const sort: SortOption = resolveSort(state.sort, state.q);
  if (sort !== defaultSortFor(state.q)) {
    params['sort'] = sort;
  }

  if (state.page > 1) {
    params['page'] = String(state.page);
  }

  return params;
}

function readSingle(params: ParamMap, key: string): string | null {
  const value: string = params.get(key)?.trim() ?? '';
  return value.length > 0 ? value : null;
}

function readMulti(params: ParamMap, key: string): readonly string[] {
  const values: string[] = params
    .getAll(key)
    .map((value: string) => value.trim())
    .filter((value: string) => value.length > 0);

  return [...new Set(values)];
}

function readPrice(params: ParamMap, key: string): number | null {
  const raw: string | null = readSingle(params, key);
  if (raw === null) {
    return null;
  }

  const value: number = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function readPage(params: ParamMap): number {
  const raw: string | null = readSingle(params, 'page');
  if (raw === null) {
    return 1;
  }

  const value: number = Number(raw);
  return Number.isInteger(value) && value >= 1 ? value : 1;
}

function writeSingle(params: Params, key: string, value: string | null): void {
  if (value !== null) {
    params[key] = value;
  }
}

function writeMulti(params: Params, key: string, values: readonly string[]): void {
  if (values.length > 0) {
    params[key] = [...values];
  }
}

function numberToParam(value: number | null): string | null {
  return value === null ? null : String(value);
}
