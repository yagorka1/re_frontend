import {
  Component,
  InputSignal,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { FacetOption } from '@/features/catalog/model/facet';
import { Checkbox } from '@/shared/ui/components/controls/checkbox/checkbox';
import { Input } from '@/shared/ui/components/controls/input/input';
import { Icon } from '@/shared/ui/components/icon/icon';

// The checkbox list behind condition, size, material and brand. Controlled: it renders the
// selection it is given and reports a toggle, so the URL stays the only owner of the state.
@Component({
  selector: 'app-catalog-facet-options',
  imports: [TranslocoPipe, Checkbox, Icon, Input],
  templateUrl: './catalog-facet-options.html',
})
export class CatalogFacetOptions {
  public readonly options: InputSignal<readonly FacetOption[]> =
    input.required<readonly FacetOption[]>();
  public readonly selected: InputSignal<readonly string[]> = input.required<readonly string[]>();
  // Brand is the long list; the others fit on screen and do not need a search box.
  public readonly searchable: InputSignal<boolean> = input(false);

  public readonly toggled: OutputEmitterRef<string> = output<string>();

  protected readonly query: WritableSignal<string> = signal('');

  protected readonly visibleOptions: Signal<readonly FacetOption[]> = computed(() => {
    const query: string = this.query().trim().toLowerCase();
    if (query === '') {
      return this.options();
    }

    return this.options().filter((option: FacetOption) =>
      option.label.toLowerCase().includes(query),
    );
  });

  protected isSelected(id: string): boolean {
    return this.selected().includes(id);
  }
}
