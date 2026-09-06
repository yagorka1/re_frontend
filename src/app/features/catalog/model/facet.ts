// One selectable value of a facet. `label` is display text rather than a translation key:
// brands, sizes, colours and cities are reference data and arrive already localised from the
// API, so the UI never translates them itself.
export interface FacetOption {
  readonly id: string;
  readonly label: string;
  // Result counts belong to the search response, not to the reference data, and the backend
  // only returns them for category, condition, brand and size.
  readonly count?: number;
}

export interface ColorOption extends FacetOption {
  readonly hex: string;
}

// The five Vinted-style levels. Unlike the other facets this is a closed set owned by the
// domain, not reference data, so it is safe to validate against when parsing a URL.
export type Condition =
  'new_with_tags' | 'new_without_tags' | 'very_good' | 'good' | 'satisfactory';

export const CONDITIONS: readonly Condition[] = [
  'new_with_tags',
  'new_without_tags',
  'very_good',
  'good',
  'satisfactory',
];

export function isCondition(value: string): value is Condition {
  return (CONDITIONS as readonly string[]).includes(value);
}
