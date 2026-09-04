import { Component } from '@angular/core';
import { CatalogFilters } from '@/features/catalog/ui/catalog-filters/catalog-filters';
import { CatalogList } from '@/features/catalog/ui/catalog-list/catalog-list';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogFilters, CatalogList],
  templateUrl: './catalog.html',
})
export class CatalogPage {}
