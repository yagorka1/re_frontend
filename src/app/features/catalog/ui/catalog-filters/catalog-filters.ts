import {
  Component,
  Signal,
  WritableSignal,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { CatalogFiltersStore } from '@/features/catalog/data/catalog-filters.store';
import { CatalogLabels } from '@/features/catalog/data/catalog-labels';
import { ActiveFilter, ActiveFilterKey } from '@/features/catalog/model/active-filter';
import { CategoryNode, categoryPath } from '@/features/catalog/model/category';
import { ColorOption, FacetOption } from '@/features/catalog/model/facet';
import { CatalogFilterState, MultiFacetKey, isSortOption } from '@/features/catalog/model/filters';
import { CatalogActiveFilters } from '@/features/catalog/ui/catalog-active-filters/catalog-active-filters';
import { CatalogFacetCategories } from '@/features/catalog/ui/catalog-facet-categories/catalog-facet-categories';
import { CatalogFacetChoice } from '@/features/catalog/ui/catalog-facet-choice/catalog-facet-choice';
import { CatalogFacetColors } from '@/features/catalog/ui/catalog-facet-colors/catalog-facet-colors';
import { CatalogFacetOptions } from '@/features/catalog/ui/catalog-facet-options/catalog-facet-options';
import {
  CatalogFacetPrice,
  PriceRange,
} from '@/features/catalog/ui/catalog-facet-price/catalog-facet-price';
import { CatalogFiltersSheet } from '@/features/catalog/ui/catalog-filters-sheet/catalog-filters-sheet';
import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Input } from '@/shared/ui/components/controls/input/input';
import { Icon } from '@/shared/ui/components/icon/icon';
import { Popover } from '@/shared/ui/components/popover/popover';
import { PopoverPanelDirective } from '@/shared/ui/components/popover/popover-panel.directive';

// The block itself owns no state: it reads the store and writes back through it, so the URL
// stays the single source of truth for what the feed shows. Desktop gets a pill per facet,
// phones get one button opening the sheet — the facet components are shared.
@Component({
  selector: 'app-catalog-filters',
  imports: [
    TranslocoPipe,
    ButtonDirective,
    Icon,
    Input,
    Popover,
    PopoverPanelDirective,
    CatalogActiveFilters,
    CatalogFacetCategories,
    CatalogFacetChoice,
    CatalogFacetColors,
    CatalogFacetOptions,
    CatalogFacetPrice,
    CatalogFiltersSheet,
  ],
  templateUrl: './catalog-filters.html',
})
export class CatalogFilters {
  private readonly store: CatalogFiltersStore = inject(CatalogFiltersStore);
  private readonly labels: CatalogLabels = inject(CatalogLabels);

  protected readonly filters: Signal<CatalogFilterState> = this.store.filters;
  protected readonly activeFacetCount: Signal<number> = this.store.activeFacetCount;

  // Every option list comes from `CatalogLabels`, never from the fixture directly: the
  // labels have to follow the language switcher.
  protected readonly sizes: readonly FacetOption[] = this.labels.sizes;
  protected readonly brands: readonly FacetOption[] = this.labels.brands;
  protected readonly categories: Signal<readonly CategoryNode[]> = this.labels.categories;
  protected readonly colors: Signal<readonly ColorOption[]> = this.labels.colors;
  protected readonly materials: Signal<readonly FacetOption[]> = this.labels.materials;
  protected readonly cities: Signal<readonly FacetOption[]> = this.labels.cities;
  protected readonly conditionOptions: Signal<readonly FacetOption[]> =
    this.labels.conditionOptions;
  protected readonly sortOptions: Signal<readonly FacetOption[]> = this.labels.sortOptions;
  protected readonly sortLabel: Signal<string> = this.labels.sortLabel;

  protected readonly isSheetOpen: WritableSignal<boolean> = signal(false);

  // Search runs on submit rather than on every keystroke: each change is a navigation, and a
  // history entry per character is unusable.
  protected readonly searchDraft: WritableSignal<string> = linkedSignal(() => this.store.q() ?? '');

  protected readonly activeFilters: Signal<readonly ActiveFilter[]> = computed(() => {
    const state: CatalogFilterState = this.filters();

    return [
      ...this.categoryFilter(state),
      ...this.multiFilters('sizes', state.sizes, this.sizes),
      ...this.multiFilters('brands', state.brands, this.brands),
      ...this.multiFilters('conditions', state.conditions, this.conditionOptions()),
      ...this.multiFilters('colors', state.colors, this.colors()),
      ...this.multiFilters('materials', state.materials, this.materials()),
      ...this.cityFilter(state),
      ...this.priceFilter(state),
    ];
  });

  protected count(facet: MultiFacetKey): number {
    return this.filters()[facet].length;
  }

  protected submitSearch(): void {
    this.store.setSearch(this.searchDraft());
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

  protected setSort(sort: string | null): void {
    if (sort !== null && isSortOption(sort)) {
      this.store.patch({ sort });
    }
  }

  protected setPrice(range: PriceRange): void {
    this.store.patch({ priceFrom: range.from, priceTo: range.to });
  }

  protected remove(filter: ActiveFilter): void {
    switch (filter.facet) {
      case 'category':
        this.setCategory(null);
        return;
      case 'city':
        this.setCity(null);
        return;
      case 'price':
        this.setPrice({ from: null, to: null });
        return;
      default:
        this.toggle(filter.facet, filter.id);
    }
  }

  protected clearAll(): void {
    this.store.resetFacets();
  }

  private categoryFilter(state: CatalogFilterState): readonly ActiveFilter[] {
    if (state.category === null) {
      return [];
    }

    const path: readonly CategoryNode[] = categoryPath(this.categories(), state.category);
    const label: string = path.length === 0 ? state.category : path[path.length - 1].label;

    return [{ facet: 'category', id: state.category, label }];
  }

  private cityFilter(state: CatalogFilterState): readonly ActiveFilter[] {
    if (state.city === null) {
      return [];
    }

    return [{ facet: 'city', id: state.city, label: labelOf(this.cities(), state.city) }];
  }

  private priceFilter(state: CatalogFilterState): readonly ActiveFilter[] {
    if (state.priceFrom === null && state.priceTo === null) {
      return [];
    }

    const key: string =
      state.priceFrom === null
        ? 'catalog.filters.priceUpTo'
        : state.priceTo === null
          ? 'catalog.filters.priceOver'
          : 'catalog.filters.priceBetween';

    return [
      {
        facet: 'price',
        id: 'price',
        labelKey: key,
        labelParams: { from: state.priceFrom ?? 0, to: state.priceTo ?? 0 },
      },
    ];
  }

  private multiFilters(
    facet: MultiFacetKey,
    selected: readonly string[],
    options: readonly FacetOption[],
  ): readonly ActiveFilter[] {
    return selected.map((id: string) => ({
      facet: facet as ActiveFilterKey,
      id,
      label: labelOf(options, id),
    }));
  }
}

// An id the reference data no longer knows still has to be removable, so it is shown as it
// stands rather than dropped from the row.
function labelOf(options: readonly FacetOption[], id: string): string {
  return options.find((option: FacetOption) => option.id === id)?.label ?? id;
}
