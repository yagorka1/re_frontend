import { Component, ModelSignal, Signal, inject, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { CatalogFiltersStore } from '@/features/catalog/data/catalog-filters.store';
import { CatalogLabels } from '@/features/catalog/data/catalog-labels';
import { CategoryNode } from '@/features/catalog/model/category';
import { ColorOption, FacetOption } from '@/features/catalog/model/facet';
import { CatalogFilterState, MultiFacetKey } from '@/features/catalog/model/filters';
import { CatalogFacetCategories } from '@/features/catalog/ui/catalog-facet-categories/catalog-facet-categories';
import { CatalogFacetChoice } from '@/features/catalog/ui/catalog-facet-choice/catalog-facet-choice';
import { CatalogFacetColors } from '@/features/catalog/ui/catalog-facet-colors/catalog-facet-colors';
import { CatalogFacetOptions } from '@/features/catalog/ui/catalog-facet-options/catalog-facet-options';
import {
  CatalogFacetPrice,
  PriceRange,
} from '@/features/catalog/ui/catalog-facet-price/catalog-facet-price';
import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';
import { Sheet } from '@/shared/ui/components/sheet/sheet';

// Every facet on one scrolling surface, which is how a phone shows a filter set: popovers
// anchored to a pill have nowhere to open on a 390px screen. The facet components are the
// same ones the desktop pill bar uses.
@Component({
  selector: 'app-catalog-filters-sheet',
  imports: [
    TranslocoPipe,
    ButtonDirective,
    Icon,
    Sheet,
    CatalogFacetCategories,
    CatalogFacetChoice,
    CatalogFacetColors,
    CatalogFacetOptions,
    CatalogFacetPrice,
  ],
  templateUrl: './catalog-filters-sheet.html',
})
export class CatalogFiltersSheet {
  public readonly open: ModelSignal<boolean> = model.required<boolean>();

  private readonly store: CatalogFiltersStore = inject(CatalogFiltersStore);
  private readonly labels: CatalogLabels = inject(CatalogLabels);

  protected readonly filters: Signal<CatalogFilterState> = this.store.filters;
  protected readonly activeFacetCount: Signal<number> = this.store.activeFacetCount;

  protected readonly sizes: readonly FacetOption[] = this.labels.sizes;
  protected readonly brands: readonly FacetOption[] = this.labels.brands;
  protected readonly categories: Signal<readonly CategoryNode[]> = this.labels.categories;
  protected readonly colors: Signal<readonly ColorOption[]> = this.labels.colors;
  protected readonly materials: Signal<readonly FacetOption[]> = this.labels.materials;
  protected readonly cities: Signal<readonly FacetOption[]> = this.labels.cities;
  protected readonly conditionOptions: Signal<readonly FacetOption[]> =
    this.labels.conditionOptions;

  protected count(facet: MultiFacetKey): number {
    return this.filters()[facet].length;
  }

  protected toggle(facet: MultiFacetKey, id: string): void {
    this.store.toggle(facet, id);
  }

  protected setCategory(category: string | null): void {
    this.store.patch({ category });
  }

  protected setCity(city: string | null): void {
    this.store.patch({ city });
  }

  protected setPrice(range: PriceRange): void {
    this.store.patch({ priceFrom: range.from, priceTo: range.to });
  }

  protected reset(): void {
    this.store.resetFacets();
  }
}
