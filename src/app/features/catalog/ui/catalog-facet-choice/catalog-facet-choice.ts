import { Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';

import { FacetOption } from '@/features/catalog/model/facet';

// Single-value facets: city and sorting. A listbox rather than checkboxes, because picking a
// second value replaces the first instead of widening the result.
@Component({
  selector: 'app-catalog-facet-choice',
  imports: [],
  templateUrl: './catalog-facet-choice.html',
})
export class CatalogFacetChoice {
  public readonly options: InputSignal<readonly FacetOption[]> =
    input.required<readonly FacetOption[]>();
  public readonly selected: InputSignal<string | null> = input.required<string | null>();
  // Sorting always has a value; city does not, and offers "any" instead.
  public readonly emptyLabel: InputSignal<string | undefined> = input<string>();

  public readonly picked: OutputEmitterRef<string | null> = output<string | null>();
}
