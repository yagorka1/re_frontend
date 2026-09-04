import { Component } from '@angular/core';
import { CatalogFilters } from '../../ui/catalog-filters/catalog-filters';
import { CatalogList } from '../../ui/catalog-list/catalog-list';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogFilters, CatalogList],
  templateUrl: './catalog.html',
})
export class CatalogPage {}
