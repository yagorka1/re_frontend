import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { CatalogFiltersStore } from '@/features/catalog/data/catalog-filters.store';
import { CATALOG_REFERENCE } from '@/features/catalog/data/catalog-reference';
import { CategoryNode } from '@/features/catalog/model/category';
import { CONDITIONS, ColorOption, Condition, FacetOption } from '@/features/catalog/model/facet';
import { SORT_OPTIONS, SortOption } from '@/features/catalog/model/filters';

type LabelMap = Record<string, string>;

interface ReferenceLabels {
  readonly categories?: LabelMap;
  readonly colors?: LabelMap;
  readonly materials?: LabelMap;
  readonly cities?: LabelMap;
}

// Every label the filter block shows, in the active language.
//
// Conditions and sort options are domain values the front end owns. Categories, colours,
// materials and cities are reference data that the API will return already localised — until
// that endpoint exists they come from the local fixture and are translated here too, which
// is the only reason `catalog.reference.*` exists in the language files. Delete that block
// along with the fixture.
//
// Sizes and brands are left alone: "XS" and "Nike" read the same in every language.
//
// `selectTranslateObject` waits for the language file and re-emits when the language
// changes; `translate()` would resolve to the raw key before the file lands.
@Injectable({ providedIn: 'root' })
export class CatalogLabels {
  private readonly transloco: TranslocoService = inject(TranslocoService);
  private readonly store: CatalogFiltersStore = inject(CatalogFiltersStore);

  private readonly conditionLabels: Signal<LabelMap> = toSignal(
    this.transloco.selectTranslateObject<LabelMap>('catalog.condition'),
    { initialValue: {} },
  );
  private readonly sortLabels: Signal<LabelMap> = toSignal(
    this.transloco.selectTranslateObject<LabelMap>('catalog.sort'),
    { initialValue: {} },
  );
  private readonly referenceLabels: Signal<ReferenceLabels> = toSignal(
    this.transloco.selectTranslateObject<ReferenceLabels>('catalog.reference'),
    { initialValue: {} },
  );

  public readonly conditionOptions: Signal<readonly FacetOption[]> = computed(() => {
    const labels: LabelMap = this.conditionLabels();
    return CONDITIONS.map((id: Condition) => ({ id, label: labels[id] ?? id }));
  });

  public readonly sortOptions: Signal<readonly FacetOption[]> = computed(() => {
    const labels: LabelMap = this.sortLabels();

    return SORT_OPTIONS.filter(
      (id: SortOption) => id !== 'relevance' || this.store.isRelevanceAvailable(),
    ).map((id: SortOption) => ({ id, label: labels[id] ?? id }));
  });

  public readonly sortLabel: Signal<string> = computed(() => {
    const sort: SortOption = this.store.sort();
    return this.sortLabels()[sort] ?? sort;
  });

  public readonly categories: Signal<readonly CategoryNode[]> = computed(() =>
    localizeTree(CATALOG_REFERENCE.categories, this.referenceLabels().categories ?? {}),
  );

  public readonly colors: Signal<readonly ColorOption[]> = computed(() => {
    const labels: LabelMap = this.referenceLabels().colors ?? {};

    return CATALOG_REFERENCE.colors.map((color: ColorOption) => ({
      ...color,
      label: labels[color.id] ?? color.label,
    }));
  });

  public readonly materials: Signal<readonly FacetOption[]> = computed(() =>
    localize(CATALOG_REFERENCE.materials, this.referenceLabels().materials ?? {}),
  );

  public readonly cities: Signal<readonly FacetOption[]> = computed(() =>
    localize(CATALOG_REFERENCE.cities, this.referenceLabels().cities ?? {}),
  );

  public readonly sizes: readonly FacetOption[] = CATALOG_REFERENCE.sizes;
  public readonly brands: readonly FacetOption[] = CATALOG_REFERENCE.brands;
}

function localize(options: readonly FacetOption[], labels: LabelMap): readonly FacetOption[] {
  return options.map((option: FacetOption) => ({
    ...option,
    label: labels[option.id] ?? option.label,
  }));
}

function localizeTree(tree: readonly CategoryNode[], labels: LabelMap): readonly CategoryNode[] {
  return tree.map((node: CategoryNode) => ({
    ...node,
    label: labels[node.id] ?? node.label,
    children: localizeTree(node.children, labels),
  }));
}
