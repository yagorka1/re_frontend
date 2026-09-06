import { Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';

import { ColorOption } from '@/features/catalog/model/facet';

// Colours are swatches rather than checkboxes: the value is the colour itself, so showing it
// is the label. The name still ships as text, for screen readers and for narrow swatches.
@Component({
  selector: 'app-catalog-facet-colors',
  imports: [],
  templateUrl: './catalog-facet-colors.html',
})
export class CatalogFacetColors {
  public readonly options: InputSignal<readonly ColorOption[]> =
    input.required<readonly ColorOption[]>();
  public readonly selected: InputSignal<readonly string[]> = input.required<readonly string[]>();

  public readonly toggled: OutputEmitterRef<string> = output<string>();

  protected isSelected(id: string): boolean {
    return this.selected().includes(id);
  }
}
