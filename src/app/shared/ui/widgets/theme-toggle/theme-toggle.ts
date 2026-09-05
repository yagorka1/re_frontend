import { Component, Signal, computed, inject } from '@angular/core';
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
  private readonly themeService: ThemeService = inject(ThemeService);

  protected readonly isDark: Signal<boolean> = this.themeService.isDark;
  protected readonly iconName: Signal<'sun' | 'moon'> = computed(() =>
    this.isDark() ? 'sun' : 'moon',
  );

  protected toggle(): void {
    this.themeService.toggle();
  }
}
