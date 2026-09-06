import { MultiFacetKey } from '@/features/catalog/model/filters';

export type ActiveFilterKey = MultiFacetKey | 'category' | 'city' | 'price';

// One removable chip in the summary row. The label comes either as text (reference data,
// already localised by the API) or as a translation key (domain values such as the
// conditions, which the front end owns) — never translated imperatively, so switching
// language re-renders the row on its own.
export interface ActiveFilter {
  readonly facet: ActiveFilterKey;
  readonly id: string;
  readonly label?: string;
  readonly labelKey?: string;
  readonly labelParams?: Record<string, string | number>;
}
