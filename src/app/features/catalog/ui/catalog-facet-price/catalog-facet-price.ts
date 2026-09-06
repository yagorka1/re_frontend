import {
  Component,
  InputSignal,
  OutputEmitterRef,
  WritableSignal,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { NumberInput } from '@/shared/ui/components/controls/number-input/number-input';

export interface PriceRange {
  readonly from: number | null;
  readonly to: number | null;
}

// Applied on an explicit action rather than per keystroke: a range is only meaningful once
// both ends are typed, and navigating on every character would fill the history with
// half-finished bounds.
@Component({
  selector: 'app-catalog-facet-price',
  imports: [TranslocoPipe, ButtonDirective, NumberInput],
  templateUrl: './catalog-facet-price.html',
})
export class CatalogFacetPrice {
  public readonly from: InputSignal<number | null> = input.required<number | null>();
  public readonly to: InputSignal<number | null> = input.required<number | null>();

  public readonly applied: OutputEmitterRef<PriceRange> = output<PriceRange>();

  // Drafts, so typing does not navigate; a bound arriving from the URL wins over an
  // abandoned draft.
  protected readonly draftFrom: WritableSignal<number | null> = linkedSignal(() => this.from());
  protected readonly draftTo: WritableSignal<number | null> = linkedSignal(() => this.to());

  protected apply(): void {
    const from: number | null = this.draftFrom();
    const to: number | null = this.draftTo();

    // An inverted range is a slip, not an intent: read it the way it was meant.
    const inverted: boolean = from !== null && to !== null && from > to;

    this.applied.emit(inverted ? { from: to, to: from } : { from, to });
  }

  protected clear(): void {
    this.applied.emit({ from: null, to: null });
  }
}
