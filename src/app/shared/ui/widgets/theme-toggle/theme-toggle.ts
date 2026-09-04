import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { ThemeService } from '@/core/theme/theme.service';
import { ButtonDirective } from '@/shared/ui/components/button/button.directive';
import { Icon } from '@/shared/ui/components/icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [TranslocoPipe, ButtonDirective, Icon],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
  protected readonly iconName = computed(() => (this.themeService.isDark() ? 'sun' : 'moon'));
}
