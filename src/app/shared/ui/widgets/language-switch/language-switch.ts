import { Component, Signal, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LanguageOption, LanguageService } from '@/core/i18n/language.service';
import { Icon } from '@/shared/ui/components/icon/icon';
import { Popover } from '@/shared/ui/components/popover/popover';
import { PopoverPanelDirective } from '@/shared/ui/components/popover/popover-panel.directive';

@Component({
  selector: 'app-language-switch',
  imports: [TranslocoPipe, Icon, Popover, PopoverPanelDirective],
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  private readonly languageService: LanguageService = inject(LanguageService);

  protected readonly languages: readonly LanguageOption[] = this.languageService.languages;
  protected readonly activeLang: Signal<string> = this.languageService.activeLang;

  protected select(id: string): void {
    this.languageService.setLanguage(id);
  }

  protected isActiveLanguage(id: string): boolean {
    return this.activeLang() === id;
  }
}
