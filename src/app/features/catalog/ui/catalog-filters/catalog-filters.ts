import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { Icon } from '@/shared/ui/components/icon/icon';
import { Input } from '@/shared/ui/components/input/input';

@Component({
  selector: 'app-catalog-filters',
  imports: [TranslocoPipe, Icon, Input],
  templateUrl: './catalog-filters.html',
})
export class CatalogFilters {}
