import { Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { CategoryNode } from '@/features/catalog/model/category';

// The whole tree, two levels deep at a time: the way across the tree, from women's dresses
// to men's shoes in one click.
@Component({
  selector: 'app-catalog-facet-categories',
  imports: [TranslocoPipe],
  templateUrl: './catalog-facet-categories.html',
})
export class CatalogFacetCategories {
  public readonly tree: InputSignal<readonly CategoryNode[]> =
    input.required<readonly CategoryNode[]>();
  public readonly selected: InputSignal<string | null> = input.required<string | null>();

  public readonly picked: OutputEmitterRef<string | null> = output<string | null>();
}
