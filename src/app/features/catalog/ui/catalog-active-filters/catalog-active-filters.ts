import { Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { ActiveFilter } from '@/features/catalog/model/active-filter';
import { Icon } from '@/shared/ui/components/icon/icon';

// The row under the pills: what is currently narrowing the feed, and how to undo it. Without
// it a facet chosen inside a popover is invisible until the popover is opened again.
@Component({
  selector: 'app-catalog-active-filters',
  imports: [TranslocoPipe, Icon],
  templateUrl: './catalog-active-filters.html',
})
export class CatalogActiveFilters {
  public readonly filters: InputSignal<readonly ActiveFilter[]> =
    input.required<readonly ActiveFilter[]>();

  public readonly removed: OutputEmitterRef<ActiveFilter> = output<ActiveFilter>();
  public readonly cleared: OutputEmitterRef<void> = output<void>();
}
